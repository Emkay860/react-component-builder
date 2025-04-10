// CanvasItem.tsx
"use client";
import { useDraggable } from "@dnd-kit/core";
import componentStyles from "../styles/componentStyles";
import { DroppedItem } from "../types";

type Props = {
  item: DroppedItem;
  onSelect?: (id: string) => void;
  isSelected?: boolean;
};

export default function CanvasItem({ item, onSelect, isSelected }: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: item.id,
    });

  const baseStyle = {
    position: "absolute" as const,
    top: item.y,
    left: item.x,
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
    zIndex: item.zIndex || 1,
    cursor: isDragging ? "grabbing" : "grab",
  };

  const styleConfig = componentStyles[item.componentType] || {};
  const containerClasses = styleConfig.container || "cursor-grab";
  const elementClasses = styleConfig.element || "";

  const renderContent = () => {
    switch (item.componentType) {
      case "button":
        return (
          <button className={elementClasses}>{item.label || "Button"}</button>
        );
      case "card":
        return <div className={elementClasses}>Card Component</div>;
      case "text":
        return <p className={elementClasses}>{item.label || "Text Element"}</p>;
      case "input": {
        const wrapperClasses = styleConfig.elementWrapper || "";
        return (
          <div className={wrapperClasses}>
            <input
              placeholder="Input Value"
              className={elementClasses}
              onPointerDown={(e) => e.stopPropagation()}
              onFocus={(e) => e.stopPropagation()}
            />
          </div>
        );
      }
      default:
        return <div>Unknown Component</div>;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={baseStyle}
      {...attributes}
      {...listeners}
      className={`${containerClasses} ${
        isSelected ? "ring-2 ring-blue-500" : ""
      }`}
      onClick={() => {
        if (onSelect) onSelect(item.id);
      }}
    >
      {renderContent()}
    </div>
  );
}
