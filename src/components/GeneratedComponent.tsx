// components/GeneratedComponent.tsx
"use client";
import React from "react";
import type { DroppedItem } from "../types";
import { generateComponentCode } from "../utils/generateComponentCode";

interface GeneratedComponentProps {
  // Optionally pass items as props if you want to dynamically update them.
  items?: DroppedItem[];
}

const sampleItems: DroppedItem[] = [
  {
    id: "sample-button-1",
    x: 0,
    y: 0,
    componentType: "button",
    label: "Sample Button",
    bgColor: "#3B82F6",
    textColor: "#fff",
    borderRadius: 4,
    fontSize: 14,
  },
  {
    id: "sample-card-1",
    x: 0,
    y: 0,
    componentType: "card",
    label: "Sample Card",
    bgColor: "#fff",
    borderRadius: 8,
    fontSize: 16,
    width: 300,
    height: 200,
  },
  {
    id: "sample-text-1",
    x: 0,
    y: 0,
    componentType: "text",
    label: "Sample Text",
    textColor: "#111827",
    fontSize: 18,
  },
  {
    id: "sample-input-1",
    x: 0,
    y: 0,
    componentType: "input",
    label: "Sample Input",
    borderColor: "#D1D5DB",
    fontSize: 16,
  },
];

const GeneratedComponent: React.FC<GeneratedComponentProps> = ({
  items = sampleItems,
}) => {
  // Generate the component code as a string if needed (for preview or copy).
  const code = generateComponentCode(items);

  return (
    <div className="flex flex-wrap gap-4 p-4 bg-gray-100">
      {items.map((item) => (
        <div key={item.id}>{/* Render each element from the snapshot */}
          {(() => {
            switch (item.componentType) {
              case "button":
                return (
                  <button
                    className="px-3 py-2 rounded shadow"
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
              case "card":
                return (
                  <div
                    className="p-4 border rounded shadow"
                    style={{
                      backgroundColor: item.bgColor,
                      borderRadius: item.borderRadius ? `${item.borderRadius}px` : undefined,
                      fontSize: item.fontSize ? `${item.fontSize}px` : undefined,
                      width: item.width ? `${item.width}px` : "auto",
                      height: item.height ? `${item.height}px` : "auto",
                    }}
                  >
                    {item.label === undefined ? "Card Component" : item.label}
                  </div>
                );
              case "text":
                return (
                  <p
                    className="p-2"
                    style={{
                      color: item.textColor,
                      fontSize: item.fontSize ? `${item.fontSize}px` : undefined,
                    }}
                  >
                    {item.label || "Text Element"}
                  </p>
                );
              case "input":
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
              default:
                return <div>Unknown Component</div>;
            }
          })()}
        </div>
      ))}
      {/* Optionally show the generated code as a preview */}
      <pre className="mt-8 bg-black p-4 rounded text-xs text-blue-300 font-mono whitespace-pre-wrap">
        {code}
      </pre>
    </div>
  );
};

export default GeneratedComponent;
