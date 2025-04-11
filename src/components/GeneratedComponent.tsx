// components/GeneratedComponent.tsx
"use client";
import React from "react";
import type { DroppedItem } from "../types";
import { generateComponentCode } from "../utils/generateComponentCode";
import { DroppedItemRenderer } from "./DroppedItemRenderer";

interface GeneratedComponentProps {
  items?: DroppedItem[];
}

// Sample items with a nested structure.
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
  // Build a map for children keyed by parentId.
  const containerMap: Record<string, DroppedItem[]> = {};
  items.forEach((item) => {
    if (item.parentId) {
      if (!containerMap[item.parentId]) containerMap[item.parentId] = [];
      containerMap[item.parentId].push(item);
    }
  });
  // Filter top-level items (no parentId)
  const topLevelItems = items.filter((item) => !item.parentId);

  // Optionally, generate the code string for preview purposes.
  const code = generateComponentCode(items);

  return (
    <>
      <div
        className="relative bg-gray-100"
        style={{ width: "100vw", height: "100vh", overflow: "auto" }}
      >
        {topLevelItems.map((item) => (
          <DroppedItemRenderer
            key={item.id}
            item={item}
            containerMap={containerMap}
          />
        ))}
      </div>
      <div>
        <pre className="mt-8 bg-black p-4 rounded text-xs text-blue-300 font-mono whitespace-pre-wrap">
          {code}
        </pre>
      </div>
    </>
  );
};

export default GeneratedComponent;
