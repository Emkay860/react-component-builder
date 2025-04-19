// src/utils/generateComponentCode.ts
import { pluginRegistry } from "../plugins/PluginRegistry";
import type { DroppedItem } from "../types";
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
    const posX = parent ? addPx(item.x - parent.x) : addPx(item.x);
    const posY = parent ? addPx(item.y - parent.y) : addPx(item.y);
    const plugin = pluginRegistry.getPlugin(item.componentType);
    if (!plugin) {
      return `<div style={{ position: 'absolute', top: '${posY}', left: '${posX}' }}>
  <div>Unknown Component: ${item.componentType}</div>
</div>`;
    }

    let childrenMarkup = "";
    if (containerMap[item.id]) {
      containerMap[item.id].forEach((child) => {
        childrenMarkup += generateItemJSX(child, item);
      });
    }
    const markup = plugin.generateMarkup(item, childrenMarkup);
    return `<div style={{ position: 'absolute', top: '${posY}', left: '${posX}' }}>
  ${markup}
</div>`;
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
