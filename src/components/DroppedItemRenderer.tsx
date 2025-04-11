// components/DroppedItemRenderer.tsx
"use client";
import React from "react";
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

// Card renderer
const CardRenderer: React.FC<DroppedItemRendererProps> = ({ item, children }) => {
  return (
    <div
      className="p-4 rounded shadow bg-gray-800 text-white relative"
      style={{
        width: item.width ? `${item.width}px` : "auto",
        height: item.height ? `${item.height}px` : "auto",
        backgroundColor: item.bgColor,
        borderRadius: item.borderRadius ? `${item.borderRadius}px` : undefined,
        fontSize: item.fontSize ? `${item.fontSize}px` : undefined,
      }}
    >
      {item.label || "Card Component"}
      {children}
    </div>
  );
};

// Button renderer
const ButtonRenderer: React.FC<DroppedItemRendererProps> = ({ item }) => {
  return (
    <button
      className="bg-black text-white px-4 py-2 rounded"
      style={{
        backgroundColor: item.bgColor,
        color: item.textColor,
        borderRadius: item.borderRadius ? `${item.borderRadius}px` : undefined,
        fontSize: item.fontSize ? `${item.fontSize}px` : undefined,
      }}
    >
      {item.label || "Button"}
    </button>
  );
};

// Text renderer
const TextRenderer: React.FC<DroppedItemRendererProps> = ({ item }) => {
  return (
    <p
      className="text-gray-400"
      style={{
        fontSize: item.fontSize ? `${item.fontSize}px` : undefined,
        color: item.textColor,
      }}
    >
      {item.label || "Text Element"}
    </p>
  );
};

// Input renderer
const InputRenderer: React.FC<DroppedItemRendererProps> = ({ item }) => {
  return (
    <input
      className="border rounded p-1"
      style={{
        borderColor: item.borderColor,
        fontSize: item.fontSize ? `${item.fontSize}px` : undefined,
      }}
      placeholder="Input Value"
    />
  );
};

const componentRenderers: Record<string, React.FC<DroppedItemRendererProps>> = {
  card: CardRenderer,
  button: ButtonRenderer,
  text: TextRenderer,
  input: InputRenderer,
};

// Recursive DroppedItemRenderer
export const DroppedItemRenderer: React.FC<DroppedItemRendererProps> = ({
  item,
  containerMap,
  parent,
}) => {
  const { x, y } = getRelativePosition(item, parent);
  const Renderer = componentRenderers[item.componentType] || (() => <div>Unknown Component</div>);

  // If this item is a container (has children in containerMap), recursively render its children.
  const children = containerMap[item.id]?.map((child) => (
    <DroppedItemRenderer key={child.id} item={child} containerMap={containerMap} parent={item} />
  ));

  return (
    <div
      style={{
        position: "absolute",
        top: `${y}px`,
        left: `${x}px`,
      }}
    >
      <Renderer item={item} containerMap={containerMap}>
        {children}
      </Renderer>
    </div>
  );
};
