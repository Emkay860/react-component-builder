'use client'
import { DndContext, DragEndEvent, DragStartEvent } from '@dnd-kit/core'
import { useState } from 'react'
import Canvas from './components/Canvas'
import Sidebar from './components/Sidebar'
import { DroppedItem } from './types'

export default function App() {
  const [items, setItems] = useState<DroppedItem[]>([])
  const [startCoordinates, setStartCoordinates] = useState<{ x: number; y: number } | null>(null)

  const handleDragStart = (event: DragStartEvent) => {
    const mouseEvent = event.activatorEvent as MouseEvent;
    // Check if the dragged item exists on the canvas (i.e. it’s being repositioned)
    const existingItem = items.find((item) => item.id === event.active.id);
    if (existingItem) {
      // For canvas item's reposition, use its stored coordinates.
      setStartCoordinates({ x: existingItem.x, y: existingItem.y });

      // Optional: update z-index to bring it to the top layer.
      setItems((prev) =>
        prev.map((item) =>
          item.id === event.active.id
            ? {
                ...item,
                zIndex: Math.max(...prev.map((i) => i.zIndex || 1)) + 1,
              }
            : item
        )
      );
    } else {
      // For a new drop from the Sidebar, record the pointer's coordinates.
      setStartCoordinates({ x: mouseEvent.clientX, y: mouseEvent.clientY });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over, delta } = event;
    if (!startCoordinates) return;
    if (over?.id !== "canvas") return;

    const canvas = document.getElementById("canvas-root");
    if (!canvas) return;
    const canvasRect = canvas.getBoundingClientRect();

    const isExistingItem = items.some((item) => item.id === active.id);

    if (isExistingItem) {
      // For repositioned items, update position by adding the pointer delta.
      const finalX = startCoordinates.x + delta.x;
      const finalY = startCoordinates.y + delta.y;
      setItems((prev) =>
        prev.map((item) =>
          item.id === active.id ? { ...item, x: finalX, y: finalY } : item
        )
      );
    } else if (active.id === "button") {
      // For a new element, transform from window to canvas coordinates.
      const finalX = startCoordinates.x + delta.x - canvasRect.left;
      const finalY = startCoordinates.y + delta.y - canvasRect.top;
      const newItem: DroppedItem = {
        id: `canvas-button-${Date.now()}`,
        x: finalX,
        y: finalY,
        zIndex: 1,
      };
      setItems((prev) => [...prev, newItem]);
    }

    setStartCoordinates(null);
  }

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex h-screen w-screen">
        <Sidebar />
        <Canvas items={items} />
      </div>
    </DndContext>
  )
}
