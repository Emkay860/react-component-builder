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
import CodePreview from "./components/CodePreview";
import GhostOverlay from "./components/GhostOverlay";
import PropertyPanel from "./components/PropertyPanel";
import Sidebar from "./components/Sidebar";
import GeneratedTestPage from "./pages/GeneratedTestPage";
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
  const [currentPage, setCurrentPage] = useState("editor");

  const handleDragStart = (event: DragStartEvent) => {
    const mouseEvent = event.activatorEvent as MouseEvent;
    setActiveId(String(event.active.id));

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

    // Obtain the canvas element rect
    const canvas = document.getElementById("canvas-root");
    if (!canvas) return;
    const canvasRect = canvas.getBoundingClientRect();
    const isExistingItem = items.some((item) => item.id === String(active.id));

    const parentId =
      over && over.id !== "canvas" && over.id !== String(active.id)
        ? String(over.id)
        : undefined;

    if (isExistingItem) {
      const finalX = startCoordinates.x + delta.x;
      const finalY = startCoordinates.y + delta.y;
      setItems((prev) =>
        prev.map((item) =>
          item.id === String(active.id)
            ? { ...item, x: finalX, y: finalY, parentId: parentId }
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
        parentId: parentId,
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

  // New deletion callback that removes an item from state.
  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    if (selectedId === id) {
      setSelectedId(null);
    }
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex p-4 bg-gray-100 space-x-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => setCurrentPage("editor")}
        >
          Editor
        </button>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded"
          onClick={() => setCurrentPage("preview")}
        >
          Preview
        </button>
      </div>

      {currentPage === "editor" && (
        <div className="flex h-screen w-screen">
          <Sidebar />
          {/* Pass the new onDelete callback into Canvas */}
          <Canvas
            items={items}
            onSelect={setSelectedId}
            selectedId={selectedId}
            onDelete={handleDelete}
          />
          <PropertyPanel
            selectedItem={items.find((item) => item.id === selectedId)}
            updateItem={updateItem}
          />
          <CodePreview items={items} />
        </div>
      )}

      {currentPage === "preview" && <GeneratedTestPage items={items} />}

      <DragOverlay>
        {activeId && activeType && <GhostOverlay activeType={activeType} />}
      </DragOverlay>
    </DndContext>
  );
}
