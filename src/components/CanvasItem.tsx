// src/components/CanvasItem.tsx
"use client";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import React, { useEffect, useRef } from "react";
import { pluginRegistry } from "../plugins/PluginRegistry";
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

  // Base style for positioning.
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

  // Look up the plugin based on componentType.
  const plugin = pluginRegistry.getPlugin(item.componentType);

  // Add some debug logging.
  console.log("CanvasItem: componentType", item.componentType);
  console.log("CanvasItem: plugin", plugin);

  // If a plugin is found, use its Render component.
  // Otherwise, for "card" type we fall back to our static rendering.
  let renderedContent;
  if (plugin) {
    renderedContent = <plugin.Render item={item} />;
  } else {
    renderedContent = <div>Unknown Component</div>;
  }

  // Obtain styling classes from our componentStyles configuration.
  const styleConfig = componentStyles[item.componentType] || {
    container: "cursor-grab",
    element: "",
  };

  return (
    <div
      ref={draggableRef}
      style={baseStyle}
      {...attributes}
      {...listeners}
      className={`${styleConfig.container} ${
        isSelected ? "ring-2 ring-blue-500" : ""
      }`}
      onContextMenu={(e) => {
        e.preventDefault();
        if (onContextMenu) onContextMenu(e, item.id);
      }}
    >
      <div ref={innerRef}>{renderedContent}</div>
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
