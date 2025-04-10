'use client'
import { useDraggable } from '@dnd-kit/core';
import { DroppedItem } from '../types';

type Props = { item: DroppedItem };

export default function CanvasItem({ item }: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: item.id,
    });

  const style = {
    position: "absolute" as const,
    top: item.y,
    left: item.x,
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
    zIndex: item.zIndex || 1,
    cursor: isDragging ? "grabbing" : "grab",
  };

  const renderContent = () => {
    switch (item.componentType) {
      case "button":
        return (
          <button className="px-3 py-1 bg-blue-500 text-white rounded">
            Button
          </button>
        );
      case "card":
        return (
          <div className="p-4 bg-white border rounded shadow">
            Card Component
          </div>
        );
      case "text":
        return <p className="p-2 text-gray-800">Text Element</p>;
      case "input":
        return (
          <div className="p-1 hover:border hover:border-dashed hover:border-red-500">
            <input
              placeholder="Input Value"
              className="border rounded p-1 text-black"
              onPointerDown={(e) => e.stopPropagation()}
              onFocus={(e) => e.stopPropagation()}
            />
          </div>
        );
      default:
        return <div>Unknown Component</div>;
    }
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {renderContent()}
    </div>
  );
}
