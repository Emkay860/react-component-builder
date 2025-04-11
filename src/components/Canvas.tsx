// src/components/Canvas.tsx
"use client";
import { useDroppable } from "@dnd-kit/core";
import React, { useState } from "react";
import { DroppedItem } from "../types";
import CanvasItem from "./CanvasItem";
import ContextMenu, { MenuItem } from "./menus/ContextMenu";

type Props = {
  items: DroppedItem[];
  onSelect: (id: string | null) => void;
  selectedId: string | null;
  // When an item is to be deleted, the parent should remove it from state.
  onDelete: (id: string) => void;
};

export default function Canvas({
  items,
  onSelect,
  selectedId,
  onDelete,
}: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: "canvas" });

  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    id: string;
  } | null>(null);

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Clear selection if the canvas itself is clicked (without modifier keys)
    if (e.currentTarget === e.target && !e.ctrlKey) {
      onSelect(null);
    }
    // Hides any open context menu
    if (contextMenu) setContextMenu(null);
  };

  // Callback for right-click on a canvas item.
  const handleItemContextMenu = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      id,
    });
    onSelect(id);
  };

  // Define menu items for the context menu.
  const menuItems: MenuItem[] = [
    {
      label: "Delete",
      onClick: () => {
        if (contextMenu) {
          onDelete(contextMenu.id);
        }
      },
    },
    // You can easily add more items here, for example:
    // { label: "Edit", onClick: () => { ... } },
    // { label: "Duplicate", onClick: () => { ... } },
  ];

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
  );
}
