// src/utils/generateComponentCode.ts
import type { DroppedItem } from "../types";

// Helper: Append "px" to numeric values.
const addPx = (num: number | undefined): string =>
  num !== undefined ? `${num}px` : "auto";

// Helper: Generate an inline style string from a style object.
const generateStyleString = (styleObj: {
  [key: string]: string | undefined;
}): string => {
  return Object.entries(styleObj)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => `${key}: '${value}'`)
    .join(", ");
};

// When an item is a container, generate its markup with position: relative
// so that absolutely positioned children are positioned inside it.
function containerMarkup(item: DroppedItem, childrenMarkup: string): string {
  const styleObj: { [key: string]: string | undefined } = {
    position: "relative", // Added to make container the reference for absolute children.
    borderRadius: item.borderRadius ? addPx(item.borderRadius) : undefined,
    fontSize: item.fontSize ? addPx(item.fontSize) : undefined,
    width: item.width ? addPx(item.width) : "auto",
    height: item.height ? addPx(item.height) : "auto",
    backgroundColor: item.bgColor,
  };
  const tag = item.containerTag || "div";
  return `<${tag} className="p-4 rounded shadow bg-gray-800 text-white" style={{ ${generateStyleString(
    styleObj
  )} }}>
  ${item.label !== undefined ? item.label : "Card Component"}
  ${childrenMarkup}
</${tag}>`;
}

// For non-container items (or when not nesting children)
function elementMarkup(item: DroppedItem): string {
  let styleObj: { [key: string]: string | undefined } = {};
  switch (item.componentType) {
    case "card": {
      styleObj = {
        // If a card is not used as a container (i.e. no children), then position: relative may not be needed.
        borderRadius: item.borderRadius ? addPx(item.borderRadius) : undefined,
        fontSize: item.fontSize ? addPx(item.fontSize) : undefined,
        width: item.width ? addPx(item.width) : "auto",
        height: item.height ? addPx(item.height) : "auto",
        backgroundColor: item.bgColor,
      };
      const tag = item.containerTag || "div";
      return `<${tag} className="p-4 rounded shadow bg-gray-800 text-white" style={{ ${generateStyleString(
        styleObj
      )} }}>
  ${item.label !== undefined ? item.label : "Card Component"}
</${tag}>`;
    }
    case "button":
      styleObj = {
        borderRadius: item.borderRadius ? addPx(item.borderRadius) : undefined,
        fontSize: item.fontSize ? addPx(item.fontSize) : undefined,
        width: item.width ? addPx(item.width) : "auto",
        height: item.height ? addPx(item.height) : "auto",
        backgroundColor: item.bgColor,
        color: item.textColor,
      };
      return `<button className="bg-black text-white px-4 py-2 rounded" style={{ ${generateStyleString(
        styleObj
      )} }}>
  ${item.label !== undefined ? item.label : "Button"}
</button>`;
    case "text":
      styleObj = {
        fontSize: item.fontSize ? addPx(item.fontSize) : undefined,
        color: item.textColor,
      };
      return `<p className="text-gray-400" style={{ ${generateStyleString(
        styleObj
      )} }}>
  ${item.label || "Text Element"}
</p>`;
    case "input":
      styleObj = {
        borderColor: item.borderColor,
        fontSize: item.fontSize ? addPx(item.fontSize) : undefined,
      };
      return `<input className="border rounded p-1" style={{ ${generateStyleString(
        styleObj
      )} }} placeholder="Input Value" />`;
    default:
      return `<div>Unknown Component</div>`;
  }
}

export function generateComponentCode(items: DroppedItem[]): string {
  // Separate top-level items (those with no parentId)
  const topLevelItems = items.filter((item) => !item.parentId);
  // Build a map of children keyed by parentId.
  const containerMap: { [parentId: string]: DroppedItem[] } = {};
  items.forEach((item) => {
    if (item.parentId) {
      if (!containerMap[item.parentId]) containerMap[item.parentId] = [];
      containerMap[item.parentId].push(item);
    }
  });

  // Recursively generate the JSX for an item.
  // If a parent is provided, we compute the child's relative position.
  const generateItemJSX = (item: DroppedItem, parent?: DroppedItem): string => {
    const posX = parent ? addPx(item.x - parent.x) : addPx(item.x);
    const posY = parent ? addPx(item.y - parent.y) : addPx(item.y);

    if (containerMap[item.id]) {
      // For container items with children, get the container's dimensions.
      const containerWidth = item.width ? addPx(item.width) : "auto";
      const containerHeight = item.height ? addPx(item.height) : "auto";

      let childrenMarkup = "";
      containerMap[item.id].forEach((child) => {
        childrenMarkup += generateItemJSX(child, item);
      });

      // Merge parent's element markup with its children.
      const mergedMarkup = containerMarkup(item, childrenMarkup);
      return `<div style={{ position: 'absolute', top: '${posY}', left: '${posX}', width: '${containerWidth}', height: '${containerHeight}' }}>
  ${mergedMarkup}
</div>`;
    } else {
      // For non-container items.
      return `<div style={{ position: 'absolute', top: '${posY}', left: '${posX}' }}>
  ${elementMarkup(item)}
</div>`;
    }
  };

  let code = `import React from 'react';

const GeneratedComponent = () => {
  return (
    <div className="relative" style={{ width: '100%', height: '100%' }}>
`;
  topLevelItems.forEach((item) => {
    code += generateItemJSX(item);
  });
  code += `  </div>
)};

export default GeneratedComponent;
`;
  return code;
}
