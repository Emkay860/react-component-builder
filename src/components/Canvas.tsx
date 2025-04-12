// src/components/Canvas.tsx
"use client";
import { useDroppable } from "@dnd-kit/core";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { DroppedItem } from "../types";
import CanvasItem from "./CanvasItem";
import ContextMenu from "./menus/ContextMenu";
import { getDefaultMenuItems } from "./menus/menuItems";

type Props = {
  items: DroppedItem[];
  onSelect: (id: string | null) => void;
  selectedId: string | null;
  onDelete: (id: string) => void;
  // Pan/Zoom state lifted from App.tsx:
  canvasZoom: number;
  canvasOffset: { x: number; y: number };
  onPanZoomChange: (zoom: number, offset: { x: number; y: number }) => void;
};

export default function Canvas({
  items,
  onSelect,
  selectedId,
  onDelete,
  canvasZoom,
  canvasOffset,
  onPanZoomChange,
}: Props) {
  // Attach the droppable ref to the container so DnD-kit works.
  const { setNodeRef, isOver } = useDroppable({ id: "canvas" });
  const containerRef = useRef<HTMLDivElement>(null);

  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    id: string;
  } | null>(null);

  // Combine the droppable ref with our local container ref.
  const combinedRef = useCallback(
    (node: HTMLDivElement | null) => {
      setNodeRef(node);
      containerRef.current = node;
    },
    [setNodeRef]
  );

  // --- Clear selection on click on empty space ---
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.currentTarget === e.target && !e.ctrlKey) {
      onSelect(null);
    }
    if (contextMenu) setContextMenu(null);
  };

  // --- Context menu handler on items ---
  const handleItemContextMenu = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, id });
    onSelect(id);
  };

  const menuItems = contextMenu
    ? getDefaultMenuItems(contextMenu.id, onDelete)
    : [];

  // --- Native Wheel Listener to enable zoom via Ctrl+wheel ---
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleNativeWheel = (event: WheelEvent) => {
      if (event.ctrlKey) {
        event.preventDefault(); // Prevent Chrome's default zoom.
        const delta = event.deltaY > 0 ? -0.1 : 0.1;
        const newZoom = Math.max(0.2, Math.min(canvasZoom + delta, 3));
        const rect = container.getBoundingClientRect();
        // Pointer position relative to container.
        const pointer = {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        };
        // Adjust offset so zoom is centered on the pointer.
        const newOffset = {
          x: pointer.x - ((pointer.x - canvasOffset.x) * newZoom) / canvasZoom,
          y: pointer.y - ((pointer.y - canvasOffset.y) * newZoom) / canvasZoom,
        };
        onPanZoomChange(newZoom, newOffset);
      }
    };

    container.addEventListener("wheel", handleNativeWheel, { passive: false });
    return () => {
      container.removeEventListener("wheel", handleNativeWheel);
    };
  }, [canvasZoom, canvasOffset, onPanZoomChange]);

  // --- Panning using Middle Mouse Button ---
  const [isPanning, setIsPanning] = useState(false);
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button === 1) {
      e.preventDefault();
      setIsPanning(true);
    }
  };
  const handleMouseUp = () => setIsPanning(false);
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isPanning) {
      onPanZoomChange(canvasZoom, {
        x: canvasOffset.x + e.movementX,
        y: canvasOffset.y + e.movementY,
      });
    }
  };

  return (
    <div
      ref={combinedRef}
      id="canvas-root"
      className={`relative flex-1 m-4 border-2 rounded-lg ${
        isOver ? "border-blue-400 bg-blue-50" : "border-gray-300 bg-gray-50"
      }`}
      onClick={handleCanvasClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      style={{ overflow: "hidden" }}
    >
      {/* Inner wrapper where pan/zoom is applied */}
      <div
        style={{
          width: "100%",
          height: "100%",
          transform: `translate(${canvasOffset.x}px, ${canvasOffset.y}px) scale(${canvasZoom})`,
          transformOrigin: "0 0",
        }}
      >
        {items.map((item) => (
          <CanvasItem
            key={item.id}
            item={item}
            onSelect={onSelect}
            isSelected={item.id === selectedId}
            onContextMenu={handleItemContextMenu}
          />
        ))}
        {items.length === 0 && (
          <p className="absolute inset-0 flex items-center justify-center text-gray-500">
            Drop here
          </p>
        )}
        {contextMenu && (
          <ContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            items={menuItems}
            onClose={() => setContextMenu(null)}
          />
        )}
      </div>
    </div>
  );
}
