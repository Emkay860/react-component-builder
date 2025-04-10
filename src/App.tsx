// App.tsx
"use client";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import { useState } from "react";
import Canvas from "./components/Canvas";
import GhostOverlay from "./components/GhostOverlay";
import PropertyPanel from "./components/PropertyPanel";
import Sidebar from "./components/Sidebar";
import { DroppedItem } from "./types";

export default function App() {
  const [items, setItems] = useState<DroppedItem[]>([]);
  const [startCoordinates, setStartCoordinates] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    const mouseEvent = event.activatorEvent as MouseEvent;
    setActiveId(String(event.active.id));

    // Check if this drag is from an element already on the canvas.
    const existingItem = items.find(
      (item) => item.id === String(event.active.id)
    );
    const draggedType = event.active.data.current?.componentType;
    if (existingItem) {
      setStartCoordinates({ x: existingItem.x, y: existingItem.y });
    } else {
      setStartCoordinates({ x: mouseEvent.clientX, y: mouseEvent.clientY });
      if (draggedType) {
        setActiveType(draggedType);
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over, delta } = event;
    setActiveId(null);
    setActiveType(null);
    if (!startCoordinates) return;
    if (over?.id !== "canvas") return;

    const canvas = document.getElementById("canvas-root");
    if (!canvas) return;
    const canvasRect = canvas.getBoundingClientRect();
    const isExistingItem = items.some((item) => item.id === String(active.id));

    if (isExistingItem) {
      const finalX = startCoordinates.x + delta.x;
      const finalY = startCoordinates.y + delta.y;
      setItems((prev) =>
        prev.map((item) =>
          item.id === String(active.id)
            ? { ...item, x: finalX, y: finalY }
            : item
        )
      );
    } else if (active.data.current?.componentType) {
      const finalX = startCoordinates.x + delta.x - canvasRect.left;
      const finalY = startCoordinates.y + delta.y - canvasRect.top;
      const newItem: DroppedItem = {
        id: `canvas-${active.data.current.componentType}-${Date.now()}`,
        x: finalX,
        y: finalY,
        zIndex: 1,
        componentType: active.data.current.componentType,
        label:
          active.data.current.componentType === "button" ||
          active.data.current.componentType === "text"
            ? active.data.current.componentType === "button"
              ? "Button"
              : "Text Element"
            : undefined,
      };
      setItems((prev) => [...prev, newItem]);
    }
    setStartCoordinates(null);
  };

  // Update an element's properties (from the Property Panel)
  const updateItem = (id: string, newProps: Partial<DroppedItem>) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...newProps } : item))
    );
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex h-screen w-screen">
        <Sidebar />
        <Canvas
          items={items}
          onSelect={setSelectedId}
          selectedId={selectedId}
        />
        <PropertyPanel
          selectedItem={items.find((item) => item.id === selectedId)}
          updateItem={updateItem}
        />
      </div>

      <DragOverlay>
        {activeId && activeType && <GhostOverlay activeType={activeType} />}
      </DragOverlay>
    </DndContext>
  );
}
