// components/GeneratedComponent.tsx
"use client";
import React, { JSX } from "react";
import type { DroppedItem } from "../types";
import { generateComponentCode } from "../utils/generateComponentCode";

interface GeneratedComponentProps {
  items?: DroppedItem[];
}

// Sample items with a nested structure:
// The card is located at (100, 100) and the button is a child of the card.
const sampleItems: DroppedItem[] = [
  {
    id: "sample-card-1",
    x: 100,
    y: 100,
    componentType: "card",
    label: "Card Component",
    bgColor: "#ffffff",
    borderRadius: 8,
    fontSize: 16,
    width: 300,
    height: 200,
  },
  {
    id: "sample-button-1",
    x: 150,
    y: 150,
    componentType: "button",
    label: "Button",
    bgColor: "#3B82F6",
    textColor: "#fff",
    borderRadius: 4,
    fontSize: 14,
    parentId: "sample-card-1",
  },
  {
    id: "sample-text-1",
    x: 50,
    y: 250,
    componentType: "text",
    label: "Sample Text",
    textColor: "#111827",
    fontSize: 18,
  },
  {
    id: "sample-input-1",
    x: 50,
    y: 300,
    componentType: "input",
    label: "Sample Input",
    borderColor: "#D1D5DB",
    fontSize: 16,
  },
];

const GeneratedComponent: React.FC<GeneratedComponentProps> = ({
  items = sampleItems,
}) => {
  // Build a map of children keyed by parentId.
  const containerMap: Record<string, DroppedItem[]> = {};
  items.forEach((item) => {
    if (item.parentId) {
      if (!containerMap[item.parentId]) containerMap[item.parentId] = [];
      containerMap[item.parentId].push(item);
    }
  });

  // Recursive renderer that creates a nested element tree.
  const renderItem = (item: DroppedItem, parent?: DroppedItem): JSX.Element => {
    // If there is a parent, compute the child's coordinates relative to it.
    const posX = parent ? item.x - parent.x : item.x;
    const posY = parent ? item.y - parent.y : item.y;

    let innerElement: JSX.Element;

    switch (item.componentType) {
      case "card":
        innerElement = (
          <div
            className="p-4 rounded shadow bg-gray-800 text-white"
            style={{
              position: "relative", // This ensures that absolute children position relative to the card itself.
              width: item.width ? `${item.width}px` : "auto",
              height: item.height ? `${item.height}px` : "auto",
              backgroundColor: item.bgColor,
              borderRadius: item.borderRadius
                ? `${item.borderRadius}px`
                : undefined,
              fontSize: item.fontSize ? `${item.fontSize}px` : undefined,
            }}
          >
            {item.label || "Card Component"}
            {containerMap[item.id] && renderChildren(item)}
          </div>
        );
        break;
      case "button":
        innerElement = (
          <button
            className="bg-black text-white px-4 py-2 rounded"
            style={{
              backgroundColor: item.bgColor,
              color: item.textColor,
              borderRadius: item.borderRadius
                ? `${item.borderRadius}px`
                : undefined,
              fontSize: item.fontSize ? `${item.fontSize}px` : undefined,
            }}
          >
            {item.label || "Button"}
          </button>
        );
        break;
      case "text":
        innerElement = (
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
        break;
      case "input":
        innerElement = (
          <input
            className="border rounded p-1"
            style={{
              borderColor: item.borderColor,
              fontSize: item.fontSize ? `${item.fontSize}px` : undefined,
            }}
            placeholder="Input Value"
          />
        );
        break;
      default:
        innerElement = <div>Unknown Component</div>;
    }

    return (
      <div
        key={item.id}
        style={{
          position: "absolute",
          top: `${posY}px`,
          left: `${posX}px`,
        }}
      >
        {innerElement}
      </div>
    );
  };

  const renderChildren = (parent: DroppedItem): JSX.Element[] | null => {
    return (
      containerMap[parent.id]?.map((child) => renderItem(child, parent)) || null
    );
  };

  // Filter for top-level items (those with no parentId)
  const topLevelItems = items.filter((item) => !item.parentId);

  const code = generateComponentCode(items);

  return (
    <>
      <div
        className="relative bg-gray-100"
        style={{ width: "100vw", height: "100vh", overflow: "auto" }}
      >
        {topLevelItems.map((item) => renderItem(item))}
      </div>

      <div>
        {/* Optionally show the generated code as a preview */}
        <pre className="mt-8 bg-black p-4 rounded text-xs text-blue-300 font-mono whitespace-pre-wrap">
          {code}
        </pre>
      </div>
    </>
  );
};

export default GeneratedComponent;
