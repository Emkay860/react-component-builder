// src/components/Canvas.tsx
"use client";
import { useDroppable } from "@dnd-kit/core";
import { MouseEvent, useRef, useState } from "react";
import PanZoom, { PanZoomHandle } from "react-easy-panzoom";
import { useZoom } from "../context/ZoomContext";
import { DroppedItem } from "../types";
import CanvasItem from "./CanvasItem";
import ContextMenu from "./menus/ContextMenu";
import { getDefaultMenuItems } from "./menus/menuItems";

type Props = {
  items: DroppedItem[];
  onSelect: (id: string, event?: MouseEvent) => void;
  selectedId: string | null;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  isDragging: boolean;
  // currentScale: number;
  // setCurrentScale: React.Dispatch<React.SetStateAction<number>>;
};

export default function Canvas({
  items,
  onSelect,
  selectedId,
  onDelete,
  onDuplicate,
  isDragging,
}: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: "canvas" });
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    id: string;
  } | null>(null);

  const { currentScale, setCurrentScale } = useZoom();

  // Create a ref to call imperative methods from PanZoom.
  const panZoomRef = useRef<PanZoomHandle | null>(null);

  const handleCanvasClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.currentTarget === e.target) {
      onSelect("", e);
    }
    if (contextMenu) setContextMenu(null);
  };

  const handleItemContextMenu = (e: MouseEvent, id: string) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, id });
    onSelect(id, e);
  };

  // Inner wrapper to stop propagation when dragging a selected item
  const handleInnerMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      e.stopPropagation();
    }
  };

  // ----- UI Controls handlers -----
  const handleZoomIn = () => {
    if (panZoomRef.current && panZoomRef.current.zoomIn) {
      panZoomRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (panZoomRef.current && panZoomRef.current.zoomOut) {
      panZoomRef.current.zoomOut();
    }
  };

  const handleReset = () => {
    if (panZoomRef.current && panZoomRef.current.reset) {
      panZoomRef.current.reset();
    }
  };

  // Here, 'Center' is implemented as a reset. If you need to center
  // on a selected element, you can modify this function accordingly.
  const handleCenterCanvas = () => {
    handleReset();
  };

  return (
    <div
      ref={setNodeRef}
      id="canvas-root"
      className={`relative flex-1 m-4 border-2 rounded-lg overflow-auto ${
        isOver ? "border-blue-400 bg-blue-50" : "border-gray-300 bg-gray-50"
      }`}
      onClick={handleCanvasClick}
      style={{ touchAction: "none" }}
    >
      <PanZoom
        ref={panZoomRef}
        onStateChange={(state) => {
          // Update the current scale whenever state changes.
          setCurrentScale(state.scale);
        }}
        minZoom={0.2}
        maxZoom={3}
      >
        <div
          onMouseDown={handleInnerMouseDown}
          style={{ position: "relative", width: "3000px", height: "3000px" }}
        >
          {items.map((item) => (
            <CanvasItem
              key={item.id}
              item={item}
              onSelect={onSelect}
              isSelected={selectedId === item.id}
              onContextMenu={handleItemContextMenu}
              currentScale={currentScale}
            />
          ))}
        </div>
      </PanZoom>

      {/* Overlay UI Controls */}
      <div
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <button
          onClick={handleZoomIn}
          style={{
            padding: "6px 10px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          +
        </button>
        <button
          onClick={handleZoomOut}
          style={{
            padding: "6px 10px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          –
        </button>
        <button
          onClick={handleReset}
          style={{
            padding: "6px 10px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Reset
        </button>
        <button
          onClick={handleCenterCanvas}
          style={{
            padding: "6px 10px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Center
        </button>
      </div>

      {items.length === 0 && (
        <p className="absolute inset-0 flex items-center justify-center text-gray-500">
          Drop here
        </p>
      )}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          items={getDefaultMenuItems(contextMenu.id, onDelete, onDuplicate)}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
}
