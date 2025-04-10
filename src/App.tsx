'use client'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import { useState } from "react";
import Canvas from "./components/Canvas";
import Sidebar from "./components/Sidebar";
import { DroppedItem } from "./types";

export default function App() {
  const [items, setItems] = useState<DroppedItem[]>([]);
  const [startCoordinates, setStartCoordinates] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    const mouseEvent = event.activatorEvent as MouseEvent;
    setActiveId(String(event.active.id)); // Convert UniqueIdentifier to string (Track which item is dragging)

    // Check if this drag is from an already placed button on the canvas
    const existingItem = items.find((item) => item.id === event.active.id);
    if (existingItem) {
      setStartCoordinates({ x: existingItem.x, y: existingItem.y });

      // Bring the dragging item to the front by updating its z-index.
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
      // For a new drop from the Sidebar, record the pointer's start position.
      setStartCoordinates({ x: mouseEvent.clientX, y: mouseEvent.clientY });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over, delta } = event;
    setActiveId(null); // Clear the ghost overlay once drop is complete
    if (!startCoordinates) return;
    if (over?.id !== "canvas") return;

    const canvas = document.getElementById("canvas-root");
    if (!canvas) return;
    const canvasRect = canvas.getBoundingClientRect();

    const isExistingItem = items.some((item) => item.id === active.id);

    if (isExistingItem) {
      const finalX = startCoordinates.x + delta.x;
      const finalY = startCoordinates.y + delta.y;
      setItems((prev) =>
        prev.map((item) =>
          item.id === active.id ? { ...item, x: finalX, y: finalY } : item
        )
      );
    } else if (active.id === "button") {
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
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex h-screen w-screen">
        <Sidebar />
        <Canvas items={items} />
      </div>

      {/* DragOverlay will render the ghost element while dragging */}
      <DragOverlay>
        {activeId === "button" && (
          <div className="px-3 py-3 bg-gray-600 text-white rounded shadow opacity-75">
            Button
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
