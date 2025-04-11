// src/utils/generateComponentCode.ts
import type { DroppedItem } from "../types";

interface NestedItem {
  item: DroppedItem;
  children: DroppedItem[];
}

export function generateComponentCode(items: DroppedItem[]): string {
  // Helper: Generate an inline style string from a style object.
  const generateStyleString = (
    styleObj: { [key: string]: string | undefined }
  ): string => {
    const entries = Object.entries(styleObj)
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => `${key}: '${value}'`);
    return entries.join(", ");
  };

  // Helper: Append "px" to numeric values.
  const addPx = (num: number | undefined): string | undefined =>
    num !== undefined ? `${num}px` : undefined;

  // Identify container items using the isContainer flag.
  const containerItems = items.filter((item) => item.isContainer);
  const assignedIds = new Set<string>();

  // For each container, find child items (based on absolute coordinates).
  const nestedContainers: NestedItem[] = [];
  for (const container of containerItems) {
    // Only proceed if container has numeric width/height defined.
    if (container.width === undefined || container.height === undefined) continue;
    const children = items.filter((child) => {
      if (child.id === container.id) return false;
      return (
        child.x >= container.x &&
        child.x <= container.x + container.width! &&
        child.y >= container.y &&
        child.y <= container.y + container.height!
      );
    });
    children.forEach((child) => assignedIds.add(child.id));
    nestedContainers.push({ item: container, children });
  }

  // Top-level items are those not assigned as children of any container.
  const topLevelItems = items.filter((item) => !assignedIds.has(item.id));

  // --- Generate code for nested containers and top-level items ---

  let code = `import React from 'react';

const GeneratedComponent = () => {
  return (
    <div className="relative" style={{ width: '100%', height: '100%' }}>
`;

  // Generate code for each container and its nested children.
  nestedContainers.forEach((nested) => {
    const container = nested.item;
    const containerOuterStyle = {
      top: addPx(container.y),
      left: addPx(container.x),
    };

    const containerInnerStyle = {
      borderRadius: container.borderRadius ? addPx(container.borderRadius) : undefined,
      fontSize: container.fontSize ? addPx(container.fontSize) : undefined,
      width: container.width ? addPx(container.width) : "auto",
      height: container.height ? addPx(container.height) : "auto",
      backgroundColor: container.bgColor,
    };

    // Use containerTag if provided, otherwise default to 'div'
    const containerTag = container.containerTag || "div";

    code += `    <div style={{ position: 'absolute', top: '${containerOuterStyle.top}', left: '${containerOuterStyle.left}' }}>
      <${containerTag} className="p-4 rounded shadow bg-gray-800 text-white" style={{ ${generateStyleString(
      containerInnerStyle
    )} }}>
  ${container.label === undefined ? "Card Component" : container.label}
      </${containerTag}>
`;
    // Create an inner relative container for children.
    code += `      <div className="relative" style={{ width: ${container.width ? `'${addPx(container.width)}'` : "'auto'"}, height: ${
      container.height ? `'${addPx(container.height)}'` : "'auto'"
    } }}>
`;
    // For each nested child, adjust its position relative to the container.
    nested.children.forEach((child) => {
      const relX = child.x - container.x;
      const relY = child.y - container.y;
      let childJSX = "";
      let childStyleObj: { [key: string]: string | undefined } = {};
      switch (child.componentType) {
        case "button": {
          childStyleObj = {
            borderRadius: child.borderRadius ? addPx(child.borderRadius) : undefined,
            fontSize: child.fontSize ? addPx(child.fontSize) : undefined,
            backgroundColor: child.bgColor,
            color: child.textColor,
          };
          childJSX = `<button className="bg-black text-white px-4 py-2 rounded" style={{ ${generateStyleString(
            childStyleObj
          )} }}>
  ${child.label === undefined ? "Button" : child.label}
</button>`;
          break;
        }
        case "text": {
          childStyleObj = {
            fontSize: child.fontSize ? addPx(child.fontSize) : undefined,
            color: child.textColor,
          };
          childJSX = `<p className="text-gray-400" style={{ ${generateStyleString(
            childStyleObj
          )} }}>
  ${child.label || "Text Element"}
</p>`;
          break;
        }
        case "input": {
          childStyleObj = {
            borderColor: child.borderColor,
            fontSize: child.fontSize ? addPx(child.fontSize) : undefined,
          };
          childJSX = `<input className="border rounded p-1" style={{ ${generateStyleString(
            childStyleObj
          )} }} placeholder="Input Value" />`;
          break;
        }
        default:
          childJSX = `<div>Unknown Component</div>`;
      }
      code += `        <div style={{ position: 'absolute', top: '${addPx(relY)}', left: '${addPx(relX)}' }}>
          ${childJSX}
        </div>
`;
    });
    code += "      </div>\n";
    code += "    </div>\n";
  });

  // Generate code for top-level items not nested in any container.
  topLevelItems.forEach((item) => {
    let itemJSX = "";
    let styleObj: { [key: string]: string | undefined } = {};
    switch (item.componentType) {
      case "button": {
        styleObj = {
          borderRadius: item.borderRadius ? addPx(item.borderRadius) : undefined,
          fontSize: item.fontSize ? addPx(item.fontSize) : undefined,
          backgroundColor: item.bgColor,
          color: item.textColor,
        };
        itemJSX = `<button className="bg-black text-white px-4 py-2 rounded" style={{ ${generateStyleString(
          styleObj
        )} }}>
  ${item.label === undefined ? "Button" : item.label}
</button>`;
        break;
      }
      case "text": {
        styleObj = {
          fontSize: item.fontSize ? addPx(item.fontSize) : undefined,
          color: item.textColor,
        };
        itemJSX = `<p className="text-gray-400" style={{ ${generateStyleString(
          styleObj
        )} }}>
  ${item.label || "Text Element"}
</p>`;
        break;
      }
      case "input": {
        styleObj = {
          borderColor: item.borderColor,
          fontSize: item.fontSize ? addPx(item.fontSize) : undefined,
        };
        itemJSX = `<input className="border rounded p-1" style={{ ${generateStyleString(
          styleObj
        )} }} placeholder="Input Value" />`;
        break;
      }
      case "card": {
        // For card items not marked as containers.
        styleObj = {
          borderRadius: item.borderRadius ? addPx(item.borderRadius) : undefined,
          fontSize: item.fontSize ? addPx(item.fontSize) : undefined,
          backgroundColor: item.bgColor,
        };
        itemJSX = `<div className="p-4 rounded shadow bg-gray-800 text-white" style={{ ${generateStyleString(
          styleObj
        )} }}>
  ${item.label === undefined ? "Card Component" : item.label}
</div>`;
        break;
      }
      default:
        itemJSX = `<div>Unknown Component</div>`;
    }
    code += `    <div style={{ position: 'absolute', top: '${addPx(item.y)}', left: '${addPx(item.x)}' }}>
  ${itemJSX}
</div>
`;
  });

  code += `  </div>
};

export default GeneratedComponent;
`;
  return code;
}
