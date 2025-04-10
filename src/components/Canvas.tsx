// Canvas.tsx
"use client";
import { useDroppable } from "@dnd-kit/core";
import { DroppedItem } from "../types";
import CanvasItem from "./CanvasItem";

type Props = {
  items: DroppedItem[];
  // Allow onSelect to accept a string or null.
  onSelect: (id: string | null) => void;
  selectedId: string | null;
};

export default function Canvas({ items, onSelect, selectedId }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: "canvas" });

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // If the click target is the canvas container itself
    // and CTRL is not held down, clear the selection.
    if (e.currentTarget === e.target && !e.ctrlKey) {
      onSelect(null);
    }
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
          isSelected={item.id === selectedId}
        />
      ))}
      {items.length === 0 && (
        <p className="absolute inset-0 flex items-center justify-center text-gray-500">
          Drop here
        </p>
      )}
    </div>
  );
}
