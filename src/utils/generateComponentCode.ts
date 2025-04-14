// src/utils/generateComponentCode.ts
import type { DroppedItem } from "../types";
import { containerMarkup, elementMarkup } from "./markupGenerators";
import { addPx } from "./styleHelpers";

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
  const generateItemJSX = (item: DroppedItem, parent?: DroppedItem): string => {
    // Compute relative positions.
    const posX = parent ? addPx(item.x - parent.x) : addPx(item.x);
    const posY = parent ? addPx(item.y - parent.y) : addPx(item.y);

    if (containerMap[item.id]) {
      const containerWidth = item.width ? addPx(item.width) : "auto";
      const containerHeight = item.height ? addPx(item.height) : "auto";

      let childrenMarkup = "";
      containerMap[item.id].forEach((child) => {
        childrenMarkup += generateItemJSX(child, item);
      });

      const mergedMarkup = containerMarkup(item, childrenMarkup);
      return `<div style={{ position: 'absolute', top: '${posY}', left: '${posX}', width: '${containerWidth}', height: '${containerHeight}' }}>
  ${mergedMarkup}
</div>`;
    } else {
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
