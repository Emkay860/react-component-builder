// src/components/DroppedItemRenderer.tsx
"use client";
import React from "react";
import { pluginRegistry } from "../plugins/PluginRegistry";
import type { DroppedItem } from "../types";

export type DroppedItemRendererProps = React.PropsWithChildren<{
  item: DroppedItem;
  containerMap: Record<string, DroppedItem[]>;
  parent?: DroppedItem;
}>;

const getRelativePosition = (item: DroppedItem, parent?: DroppedItem) => {
  if (parent) {
    return {
      x: item.x - parent.x,
      y: item.y - parent.y,
    };
  }
  return { x: item.x, y: item.y };
};

export const DroppedItemRenderer: React.FC<DroppedItemRendererProps> = ({
  item,
  containerMap,
  parent,
}) => {
  const { x, y } = getRelativePosition(item, parent);
  const plugin = pluginRegistry.getPlugin(item.componentType);
  const Renderer =
    plugin?.Render ||
    (() => <div>Unknown Component: {item.componentType}</div>);

  const nestedChildren = containerMap[item.id]?.map((child) => (
    <DroppedItemRenderer
      key={child.id}
      item={child}
      containerMap={containerMap}
      parent={item}
    />
  ));

  const style: React.CSSProperties = {
    position: "absolute",
    top: `${y}px`,
    left: `${x}px`,
  };

  return (
    <div style={style}>
      <Renderer item={item}>{nestedChildren}</Renderer>
    </div>
  );
};
