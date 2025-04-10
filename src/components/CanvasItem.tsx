// CanvasItem.tsx
"use client";
import { useDraggable } from "@dnd-kit/core";
import { useEffect, useRef } from "react";
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

  const innerRef = useRef<HTMLDivElement>(null);

  // Attach a native pointerdown listener to guarantee selection events fire,
  // regardless of how dnd-kit’s synthetic events behave.
  useEffect(() => {
    const innerEl = innerRef.current;
    if (!innerEl) return;

    const handlePointerDown = () => {
      // You can choose here whether you want to use different logic for inputs.
      // In this example, we fire onSelect for all elements.
      if (!isDragging && onSelect) {
        onSelect(item.id);
      }
    };

    innerEl.addEventListener("pointerdown", handlePointerDown, {
      capture: true,
    });
    return () => {
      innerEl.removeEventListener("pointerdown", handlePointerDown, {
        capture: true,
      });
    };
  }, [isDragging, onSelect, item.id]);

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
      case "button": {
        // Create a style object using updated properties from the item.
        const buttonStyle: React.CSSProperties = {
          backgroundColor: item.bgColor, // comes from updated state
          color: item.textColor,
          borderRadius:
            item.borderRadius !== undefined
              ? `${item.borderRadius}px`
              : undefined,
          fontSize:
            item.fontSize !== undefined ? `${item.fontSize}px` : undefined,
        };
        return (
          <button className={elementClasses} style={buttonStyle}>
            {item.label || "Button"}
          </button>
        );
      }
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
              // For inputs, we still want to stop propagation for pointer events
              // so that editing works smoothly.
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
    >
      {/* 
        innerRef is attached to this wrapper so that our native pointerdown listener
        fires in capture mode.
      */}
      <div ref={innerRef}>{renderContent()}</div>
    </div>
  );
}
