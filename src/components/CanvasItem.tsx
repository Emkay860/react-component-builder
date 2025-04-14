// src/components/CanvasItem.tsx
"use client";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import React, { useEffect, useRef } from "react";
import componentStyles from "../styles/componentStyles";
import { DroppedItem } from "../types";

type Props = {
  item: DroppedItem;
  onSelect?: (id: string) => void;
  isSelected?: boolean;
  onContextMenu?: (e: React.MouseEvent, id: string) => void;
};

export default function CanvasItem({
  item,
  onSelect,
  isSelected,
  onContextMenu,
}: Props) {
  // useDraggable for all items.
  const {
    attributes,
    listeners,
    setNodeRef: draggableRef,
    transform,
    isDragging,
  } = useDraggable({
    id: item.id,
  });

  // useDroppable for the item.
  const { setNodeRef: droppableRef } = useDroppable({ id: item.id });

  const innerRef = useRef<HTMLDivElement>(null);

  // Attach a native pointerdown listener to guarantee selection.
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

  // Build common CSS styles from additional properties.
  const getCommonStyles = (item: DroppedItem): React.CSSProperties => ({
    margin: item.margin || undefined,
    padding: item.padding || undefined,
    borderWidth:
      item.borderWidth !== undefined ? `${item.borderWidth}px` : undefined,
    borderStyle: item.borderStyle || undefined,
    borderColor: item.borderColor || undefined,
    boxShadow: item.boxShadow || undefined,
    opacity: item.opacity,
    fontFamily: item.fontFamily || undefined,
  });

  // Compute dynamic styles based on component type, merging with common styles.
  const getDynamicStyle = (item: DroppedItem): React.CSSProperties => {
    let style: React.CSSProperties = {};
    const commonStyles = getCommonStyles(item);

    switch (item.componentType) {
      case "button":
        style = {
          backgroundColor: item.bgColor,
          color: item.textColor,
          borderRadius:
            item.borderRadius !== undefined
              ? `${item.borderRadius}px`
              : undefined,
          fontSize:
            item.fontSize !== undefined ? `${item.fontSize}px` : undefined,
          width: item.width ? `${item.width}px` : "auto",
          height: item.height ? `${item.height}px` : "auto",
          ...commonStyles,
        };
        break;
      case "card":
        style = {
          backgroundColor: item.bgColor,
          borderRadius:
            item.borderRadius !== undefined
              ? `${item.borderRadius}px`
              : undefined,
          fontSize:
            item.fontSize !== undefined ? `${item.fontSize}px` : undefined,
          width: item.width ? `${item.width}px` : "auto",
          height: item.height ? `${item.height}px` : "auto",
          ...commonStyles,
        };
        break;
      case "text":
        style = {
          color: item.textColor,
          fontSize:
            item.fontSize !== undefined ? `${item.fontSize}px` : undefined,
          ...commonStyles,
        };
        break;
      case "input":
        style = {
          borderColor: item.borderColor,
          fontSize:
            item.fontSize !== undefined ? `${item.fontSize}px` : undefined,
          width: item.width ? `${item.width}px` : "auto",
          height: item.height ? `${item.height}px` : "auto",
          ...commonStyles,
        };
        break;
      default:
        style = { ...commonStyles };
    }
    return style;
  };

  const baseStyle: React.CSSProperties = {
    position: "absolute",
    top: item.y,
    left: item.x,
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
    zIndex: item.zIndex || 1,
    cursor: isDragging ? "grabbing" : "grab",
  };

  // Get styling classes from our componentStyles configuration.
  const styleConfig = componentStyles[item.componentType] || {
    container: "cursor-grab",
    element: "",
  };

  const containerClasses = styleConfig.container;
  const elementClasses = styleConfig.element;

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
      ref={draggableRef}
      style={baseStyle}
      {...attributes}
      {...listeners}
      className={`${containerClasses} ${
        isSelected ? "ring-2 ring-blue-500" : ""
      }`}
      onContextMenu={(e) => {
        e.preventDefault();
        if (onContextMenu) onContextMenu(e, item.id);
      }}
    >
      {/* Main content */}
      <div ref={innerRef}>{renderContent()}</div>

      {/* Render a full overlay for container items */}
      {item.isContainer && (
        <div
          ref={droppableRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        />
      )}
    </div>
  );
}
