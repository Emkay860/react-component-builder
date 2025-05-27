// src/components/Canvas.tsx
"use client";
import { useDroppable } from "@dnd-kit/core";
import { MouseEvent, useState } from "react";
// import { useZoom } from "../context/ZoomContext";
import { DroppedItem } from "../types";
import CanvasItem from "./CanvasItem";
import ContextMenu from "./menus/ContextMenu";
import { getDefaultMenuItems } from "./menus/menuItems";
import GridBackground from "./GridBackground";
import Rulers from "./Rulers";
import CanvasControls from "./CanvasControls";

type Props = {
  items: DroppedItem[];
  onSelect: (id: string, event?: MouseEvent) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  isDragging: boolean;
  selectedIds: string[];
  onGroup: () => void;
  onUngroup: () => void;
};

export default function Canvas({
  items,
  onSelect,
  onDelete,
  onDuplicate,
  selectedIds,
  onGroup,
  onUngroup,
}: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: "canvas" });
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    id: string;
  } | null>(null);
  const [showGrid, setShowGrid] = useState(true);
  const [showRulers, setShowRulers] = useState(true);
  const gridSize = 40; // px
  const canvasWidth = 3000;
  const canvasHeight = 3000;

  const handleCanvasClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    if (e.currentTarget === e.target) {
      onSelect("", e);
    }
    if (contextMenu) setContextMenu(null);
  };

  const handleItemContextMenu = (e: MouseEvent, id: string) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, id });
  };

  return (
    <div
      ref={setNodeRef}
      id="canvas-root"
      className={`relative flex-1 m-4 border-2 rounded-lg overflow-auto ${
        isOver ? "border-blue-400 bg-blue-50" : "border-gray-300 bg-gray-50"
      }`}
      onClick={handleCanvasClick}
      style={{ touchAction: "none", overflow: "hidden" }}
    >
      <Rulers show={showRulers} gridSize={gridSize} width={canvasWidth} height={canvasHeight} />
      <div
        style={{
          position: "relative",
          width: canvasWidth,
          height: canvasHeight,
          overflow: "hidden",
          background: "#fff",
        }}
      >
        <GridBackground
          show={showGrid}
          gridSize={gridSize}
          panZoomState={{ scale: 1, translateX: 0, translateY: 0 }}
          width={canvasWidth}
          height={canvasHeight}
        />
        {items.map((item) => (
          <CanvasItem
            key={item.id}
            item={item}
            onSelect={onSelect}
            isSelected={selectedIds.includes(item.id)}
            groupId={item.groupId}
            onContextMenu={handleItemContextMenu}
            currentScale={1}
          />
        ))}
      </div>
      <CanvasControls
        showGrid={showGrid}
        setShowGrid={setShowGrid}
        showRulers={showRulers}
        setShowRulers={setShowRulers}
        onZoomIn={() => {}}
        onZoomOut={() => {}}
        onReset={() => {}}
        onCenter={() => {}}
      />
      {items.length === 0 && (
        <p className="absolute inset-0 flex items-center justify-center text-gray-500">
          Drop here
        </p>
      )}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          items={getDefaultMenuItems(
            contextMenu.id,
            onDelete,
            onDuplicate,
            selectedIds,
            items,
            onGroup,
            onUngroup
          )}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
}
