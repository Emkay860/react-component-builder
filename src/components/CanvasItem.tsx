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

  // Helper: Generate a dynamic inline style based on the item's properties.
  const getDynamicStyle = (item: DroppedItem): React.CSSProperties => {
    switch (item.componentType) {
      case "button":
        return {
          backgroundColor: item.bgColor,
          color: item.textColor,
          borderRadius: item.borderRadius !== undefined ? `${item.borderRadius}px` : undefined,
          fontSize: item.fontSize !== undefined ? `${item.fontSize}px` : undefined,
        };
      case "card":
        return {
          backgroundColor: item.bgColor,
          borderRadius: item.borderRadius !== undefined ? `${item.borderRadius}px` : undefined,
          fontSize: item.fontSize !== undefined ? `${item.fontSize}px` : undefined,
          // Apply width and height if provided; otherwise fallback to auto.
          width: item.width ? `${item.width}px` : "auto",
          height: item.height ? `${item.height}px` : "auto",
        };
      case "text":
        return {
          color: item.textColor,
          fontSize: item.fontSize !== undefined ? `${item.fontSize}px` : undefined,
        };
      case "input":
        return {
          borderColor: item.borderColor,
          fontSize: item.fontSize !== undefined ? `${item.fontSize}px` : undefined,
        };
      default:
        return {};
    }
  };

  const renderContent = () => {
    switch (item.componentType) {
      case "button": {
        const dynamicStyle = getDynamicStyle(item);
        return (
          <button className={elementClasses} style={dynamicStyle}>
            {item.label || "Button"}
          </button>
        );
      }
      case "card": {
        const dynamicStyle = getDynamicStyle(item);
        return (
          <div className={elementClasses} style={dynamicStyle}>
            {item.label === undefined ? "Card Component" : item.label}
          </div>
        );
      }
      case "text": {
        const dynamicStyle = getDynamicStyle(item);
        return (
          <p className={elementClasses} style={dynamicStyle}>
            {item.label || "Text Element"}
          </p>
        );
      }
      case "input": {
        const wrapperClasses = styleConfig.elementWrapper || "";
        // For input, we stop propagation so that native editing works.
        return (
          <div className={wrapperClasses}>
            <input
              placeholder="Input Value"
              className={elementClasses}
              style={getDynamicStyle(item)}
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
