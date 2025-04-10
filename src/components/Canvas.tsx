'use client'
import { useDroppable } from "@dnd-kit/core";
import { DroppedItem } from "../types";
import CanvasItem from "./CanvasItem";

type Props = { items: DroppedItem[] };

export default function Canvas({ items }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: "canvas" });

  return (
    <div
      ref={setNodeRef}
      id="canvas-root"
      className={`relative flex-1 m-4 border-2 rounded-lg ${
        isOver ? "border-blue-400 bg-blue-50" : "border-gray-300 bg-gray-50"
      }`}
    >
      {items.map((item) => (
        <CanvasItem key={item.id} item={item} />
      ))}
      {items.length === 0 && (
        <p className="absolute inset-0 flex items-center justify-center text-gray-500">
          Drop here
        </p>
      )}
    </div>
  );
}
