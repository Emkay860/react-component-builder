"use client";
import { useDroppable } from "@dnd-kit/core";
import React, { useState } from "react";
import { DroppedItem } from "../types";
import CanvasItem from "./CanvasItem";
import ContextMenu from "./menus/ContextMenu";
import { getDefaultMenuItems } from "./menus/menuItems";

type Props = {
  items: DroppedItem[];
  onSelect: (id: string, event?: React.MouseEvent) => void;
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

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.currentTarget === e.target) {
      onSelect("", e);
    }
    if (contextMenu) setContextMenu(null);
  };

  const handleItemContextMenu = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, id });
    onSelect(id, e);
  };

  return (
    <div
      ref={setNodeRef}
      id="canvas-root"
      className={`relative flex-1 m-4 border-2 rounded-lg ${
        isOver ? "border-blue-400 bg-blue-50" : "border-gray-300 bg-gray-50"
      }`}
      onClick={handleCanvasClick}
    >
      {items.map((item) => (
        <CanvasItem
          key={item.id}
          item={item}
          onSelect={onSelect}
          isSelected={selectedId === item.id}
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
          items={getDefaultMenuItems(contextMenu.id, onDelete, onDuplicate)}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
}
