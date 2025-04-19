// src/components/Canvas.tsx
"use client";
import { useDroppable } from "@dnd-kit/core";
import { MouseEvent, useState } from "react";
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
};

export default function Canvas({
  items,
  onSelect,
  selectedId,
  onDelete,
  onDuplicate,
}: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: "canvas" });
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    id: string;
  } | null>(null);

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

  return (
    <div
      ref={setNodeRef}
      id="canvas-root"
      className={`relative flex-1 m-4 border-2 rounded-lg overflow-auto ${
        isOver ? "border-blue-400 bg-blue-50" : "border-gray-300 bg-gray-50"
      }`}
      onClick={handleCanvasClick}
    >
      {/* Inner container simulating a large, "infinite" canvas */}
      <div style={{ position: "relative", width: "3000px", height: "3000px" }}>
        {items.map((item) => (
          <CanvasItem
            key={item.id}
            item={item}
            onSelect={onSelect}
            isSelected={selectedId === item.id}
            onContextMenu={handleItemContextMenu}
          />
        ))}
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
