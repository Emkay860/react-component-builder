// src/utils/generateComponentCode.ts
import { pluginRegistry } from "../plugins/PluginRegistry";
import type { DroppedItem } from "../types";
import { containerMarkup, elementMarkup } from "./markupGenerators";

export function generateComponentCode(items: DroppedItem[]): string {
  // Build a map of children keyed by parentId (same as Navigator)
  const containerMap: { [parentId: string]: DroppedItem[] } = {};
  items.forEach((item) => {
    if (item.parentId) {
      if (!containerMap[item.parentId]) containerMap[item.parentId] = [];
      containerMap[item.parentId].push(item);
    }
  });
  // Find top-level items (no parentId)
  const topLevelItems = items.filter((item) => !item.parentId);

  // IMPORTANT: The isContainer property is set ONLY by the user via the Property Panel.
  // Do NOT infer or mutate isContainer in code. It must reflect only user intent.
  const generateItemJSX = (item: DroppedItem): string => {
    const plugin = pluginRegistry.getPlugin(item.componentType);
    if (!plugin) {
      return `<div><div>Unknown Component: ${item.componentType}</div></div>`;
    }
    let childrenMarkup = "";
    if (containerMap[item.id]) {
      // Sort children by x, then y
      const sortedChildren = [...containerMap[item.id]].sort((a, b) => (a.x !== b.x ? a.x - b.x : a.y - b.y));
      if (item.isContainer) {
        childrenMarkup = `<div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>` +
          sortedChildren.map((child) => generateItemJSX(child)).join("") +
          `</div>`;
      } else {
        childrenMarkup = sortedChildren.map((child) => generateItemJSX(child)).join("");
      }
    }
    // Use containerMarkup for containers, elementMarkup for others
    if (item.isContainer) {
      return containerMarkup(item, childrenMarkup);
    } else {
      return elementMarkup(item) + childrenMarkup;
    }
  };

  let code = `import React from 'react';\n\nconst GeneratedComponent = () => {\n  return (\n`;
  if (topLevelItems.length === 1) {
    // If there is a single root, render it directly (no extra wrapper)
    code += generateItemJSX(topLevelItems[0]);
  } else {
    // Multiple roots: wrap in a flex container
    code += `    <div className=\"relative\" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>\n`;
    topLevelItems.forEach((item) => {
      code += generateItemJSX(item);
    });
    code += `  </div>\n`;
  }
  code += `)};\n\nexport default GeneratedComponent;\n`;
  return code;
}
