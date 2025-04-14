// src/components/DroppedItemRenderer.tsx
"use client";
import React from "react";
import type { DroppedItem } from "../types";

export type DroppedItemRendererProps = React.PropsWithChildren<{
  item: DroppedItem;
  containerMap: Record<string, DroppedItem[]>;
  parent?: DroppedItem;
}>;

// Compute the relative position of a dropped item to its parent, if any.
const getRelativePosition = (item: DroppedItem, parent?: DroppedItem) => {
  if (parent) {
    return {
      x: item.x - parent.x,
      y: item.y - parent.y,
    };
  }
  return { x: item.x, y: item.y };
};

// Helper to extract custom CSS properties for preview.
const getPreviewCommonStyle = (item: DroppedItem): React.CSSProperties => ({
  margin: item.margin,
  padding: item.padding,
  borderWidth:
    item.borderWidth !== undefined ? `${item.borderWidth}px` : undefined,
  borderStyle: item.borderStyle,
  borderColor: item.borderColor,
  boxShadow: item.boxShadow,
  opacity: item.opacity,
  fontFamily: item.fontFamily,
  zIndex: item.zIndex,
});

// Card renderer for preview.
const CardRenderer: React.FC<DroppedItemRendererProps> = ({
  item,
  children,
}) => {
  return (
    <div
      className="p-4"
      style={{
        width: item.width ? `${item.width}px` : "auto",
        height: item.height ? `${item.height}px` : "auto",
        backgroundColor: item.bgColor,
        borderRadius: item.borderRadius ? `${item.borderRadius}px` : undefined,
        fontSize: item.fontSize ? `${item.fontSize}px` : undefined,
        ...getPreviewCommonStyle(item),
      }}
    >
      {item.label || "Card Component"}
      {children}
    </div>
  );
};

// Button renderer for preview.
const ButtonRenderer: React.FC<DroppedItemRendererProps> = ({ item }) => {
  return (
    <button
      className=""
      style={{
        width: item.width ? `${item.width}px` : "auto",
        height: item.height ? `${item.height}px` : "auto",
        backgroundColor: item.bgColor,
        color: item.textColor,
        borderRadius: item.borderRadius ? `${item.borderRadius}px` : undefined,
        fontSize: item.fontSize ? `${item.fontSize}px` : undefined,
        ...getPreviewCommonStyle(item),
      }}
    >
      {item.label || "Button"}
    </button>
  );
};

// Text renderer for preview.
const TextRenderer: React.FC<DroppedItemRendererProps> = ({ item }) => {
  return (
    <p
      className=""
      style={{
        fontSize: item.fontSize ? `${item.fontSize}px` : undefined,
        color: item.textColor,
        ...getPreviewCommonStyle(item),
      }}
    >
      {item.label || "Text Element"}
    </p>
  );
};

// Input renderer for preview.
const InputRenderer: React.FC<DroppedItemRendererProps> = ({ item }) => {
  return (
    <input
      className=""
      style={{
        borderColor: item.borderColor,
        fontSize: item.fontSize ? `${item.fontSize}px` : undefined,
        ...getPreviewCommonStyle(item),
      }}
      placeholder="Input Value"
    />
  );
};

// Map each component type to its preview renderer.
const componentRenderers: Record<string, React.FC<DroppedItemRendererProps>> = {
  card: CardRenderer,
  button: ButtonRenderer,
  text: TextRenderer,
  input: InputRenderer,
};

// Recursive DroppedItemRenderer for previewing nested components.
export const DroppedItemRenderer: React.FC<DroppedItemRendererProps> = ({
  item,
  containerMap,
  parent,
}) => {
  const { x, y } = getRelativePosition(item, parent);

  // The outer wrapper handles absolute positioning relative to the parent.
  const wrapperStyle: React.CSSProperties = {
    position: "absolute",
    top: `${y}px`,
    left: `${x}px`,
  };

  const Renderer =
    componentRenderers[item.componentType] ||
    (() => <div>Unknown Component</div>);

  // Recursively render children if present.
  const children = containerMap[item.id]?.map((child) => (
    <DroppedItemRenderer
      key={child.id}
      item={child}
      containerMap={containerMap}
      parent={item}
    />
  ));

  return (
    <div style={wrapperStyle}>
      <Renderer item={item} containerMap={containerMap}>
        {children}
      </Renderer>
    </div>
  );
};
