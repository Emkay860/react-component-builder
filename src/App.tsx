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

  // --- Pan/Zoom state in App (virtual coordinates) ---
  const [canvasZoom, setCanvasZoom] = useState(1);
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
  const handlePanZoomChange = (
    newZoom: number,
    newOffset: { x: number; y: number }
  ) => {
    setCanvasZoom(newZoom);
    setCanvasOffset(newOffset);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const mouseEvent = event.activatorEvent as MouseEvent;
    setActiveId(String(event.active.id));

    // Obtain the canvas drop zone for coordinate conversion.
    const canvas = document.getElementById("canvas-root");
    if (!canvas) return;
    const canvasRect = canvas.getBoundingClientRect();

    const draggedType = event.active.data.current?.componentType;
    const existingItem = items.find(
      (item) => item.id === String(event.active.id)
    );

    if (existingItem) {
      // For an existing item, we're already storing virtual coordinates.
      setStartCoordinates({ x: existingItem.x, y: existingItem.y });
    } else {
      // Convert from screen to virtual coordinates:
      const virtualX =
        (mouseEvent.clientX - canvasRect.left - canvasOffset.x) / canvasZoom;
      const virtualY =
        (mouseEvent.clientY - canvasRect.top - canvasOffset.y) / canvasZoom;
      setStartCoordinates({ x: virtualX, y: virtualY });
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

    // Even with a threshold check, now we add the scaled delta.
    const threshold = 1;
    if (Math.abs(delta.x) < threshold && Math.abs(delta.y) < threshold) {
      setStartCoordinates(null);
      return;
    }

    // For delta conversion, note that if drag delta is in screen pixels,
    // then the corresponding change in virtual coordinates is:
    const virtualDeltaX = delta.x / canvasZoom;
    const virtualDeltaY = delta.y / canvasZoom;

    // Final virtual coordinates:
    const finalVirtualX = startCoordinates.x + virtualDeltaX;
    const finalVirtualY = startCoordinates.y + virtualDeltaY;

    // (The drop zone's rect is no longer needed because we already converted the start)
    const isExistingItem = items.some((item) => item.id === String(active.id));
    const parentId =
      over && over.id !== "canvas" && over.id !== String(active.id)
        ? String(over.id)
        : undefined;

    if (isExistingItem) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === String(active.id)
            ? { ...item, x: finalVirtualX, y: finalVirtualY, parentId }
            : item
        )
      );
    } else if (active.data.current?.componentType) {
      // Create a new item.
      const newItem: DroppedItem = {
        id: `canvas-${active.data.current.componentType}-${Date.now()}`,
        x: finalVirtualX,
        y: finalVirtualY,
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

  // Update an element’s properties from the property panel.
  const updateItem = (id: string, newProps: Partial<DroppedItem>) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...newProps } : item))
    );
  };

  // New deletion callback.
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
          <Canvas
            items={items}
            onSelect={setSelectedId}
            selectedId={selectedId}
            onDelete={handleDelete}
            canvasZoom={canvasZoom}
            canvasOffset={canvasOffset}
            onPanZoomChange={handlePanZoomChange}
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
