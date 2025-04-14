// src/components/DroppedItemRenderer.tsx
"use client";
import React from "react";
import type { DroppedItem } from "../types";
import { ButtonRenderer } from "./renderers/ButtonRenderer";
import { CardRenderer } from "./renderers/CardRenderer";
import { InputRenderer } from "./renderers/InputRenderer";
import { TextRenderer } from "./renderers/TextRenderer";

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
