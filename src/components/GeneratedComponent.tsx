// components/GeneratedComponent.tsx
"use client";
import React from "react";
import type { DroppedItem } from "../types";
import { generateComponentCode } from "../utils/generateComponentCode";
import CodeBlock from "./CodeBlock";
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
        style={{ height: "100vh", overflow: "auto" }}
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
        {/* <pre className="mt-8 bg-black p-4 rounded text-xs text-blue-300 font-mono whitespace-pre-wrap"> */}
        <CodeBlock language="javascript">{code}</CodeBlock>
        {/* </pre> */}
      </div>
    </>
  );
};

export default GeneratedComponent;
