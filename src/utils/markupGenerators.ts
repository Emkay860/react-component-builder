// src/utils/markupGenerators.ts
import type { DroppedItem } from "../types";
import { getCommonStyles } from "./commonStylesHelper";
import { addPx, generateStyleString } from "./styleHelpers";

/**
 * Helper to normalize a style object so that every value is a string or undefined.
 */
function normalizeStyles(styles: {
  [key: string]: string | number | undefined;
}): { [key: string]: string | undefined } {
  const normalized: { [key: string]: string | undefined } = {};
  Object.entries(styles).forEach(([key, value]) => {
    if (value === undefined) {
      normalized[key] = undefined;
    } else if (typeof value === "number") {
      // Convert number to string. (For certain properties, you might want to append a unit if needed.)
      normalized[key] = String(value);
    } else {
      normalized[key] = value;
    }
  });
  return normalized;
}

/**
 * Merges structural styles with the common styles and normalizes the result.
 */
function mergeStyles(
  structural: { [key: string]: string | undefined },
  common: React.CSSProperties
): { [key: string]: string | undefined } {
  const merged = { ...structural, ...common };
  return normalizeStyles(merged);
}

/**
 * Generate markup for a container element.
 */
export function containerMarkup(
  item: DroppedItem,
  childrenMarkup: string
): string {
  // Structural style properties (performing conversion using addPx where needed).
  const structuralStyle: { [key: string]: string | undefined } = {
    position: "relative",
    borderRadius: item.borderRadius ? addPx(item.borderRadius) : undefined,
    fontSize: item.fontSize ? addPx(item.fontSize) : undefined,
    width: item.width ? addPx(item.width) : "auto",
    height: item.height ? addPx(item.height) : "auto",
    // Use backgroundColor property (using item.backgroundColor if set, falling back to item.bgColor)
    backgroundColor: item.backgroundColor || item.bgColor,
  };

  // Merge with common styles.
  const completeStyle = mergeStyles(structuralStyle, getCommonStyles(item));

  const tag = item.containerTag || "div";
  return `<${tag} className="p-4 rounded shadow bg-gray-800 text-white" style={{ ${generateStyleString(
    completeStyle
  )} }}>
  ${item.label !== undefined ? item.label : "Card Component"}
  ${childrenMarkup}
</${tag}>`;
}

/**
 * Generate markup for a single element (non-container).
 */
export function elementMarkup(item: DroppedItem): string {
  let structuralStyle: { [key: string]: string | undefined } = {};
  switch (item.componentType) {
    case "card": {
      structuralStyle = {
        borderRadius: item.borderRadius ? addPx(item.borderRadius) : undefined,
        fontSize: item.fontSize ? addPx(item.fontSize) : undefined,
        width: item.width ? addPx(item.width) : "auto",
        height: item.height ? addPx(item.height) : "auto",
        backgroundColor: item.backgroundColor || item.bgColor,
      };
      {
        const completeStyle = mergeStyles(
          structuralStyle,
          getCommonStyles(item)
        );
        const tag = item.containerTag || "div";
        return `<${tag} className="p-4 rounded shadow bg-gray-800 text-white" style={{ ${generateStyleString(
          completeStyle
        )} }}>
  ${item.label !== undefined ? item.label : "Card Component"}
</${tag}>`;
      }
    }
    case "button": {
      structuralStyle = {
        borderRadius: item.borderRadius ? addPx(item.borderRadius) : undefined,
        fontSize: item.fontSize ? addPx(item.fontSize) : undefined,
        width: item.width ? addPx(item.width) : "auto",
        height: item.height ? addPx(item.height) : "auto",
        backgroundColor: item.backgroundColor || item.bgColor,
        color: item.textColor,
      };
      const completeStyle = mergeStyles(structuralStyle, getCommonStyles(item));
      return `<button className="bg-black text-white px-4 py-2 rounded" style={{ ${generateStyleString(
        completeStyle
      )} }}>
  ${item.label !== undefined ? item.label : "Button"}
</button>`;
    }
    case "text": {
      structuralStyle = {
        fontSize: item.fontSize ? addPx(item.fontSize) : undefined,
        color: item.textColor,
      };
      const completeStyle = mergeStyles(structuralStyle, getCommonStyles(item));
      return `<p className="text-gray-400" style={{ ${generateStyleString(
        completeStyle
      )} }}>
  ${item.label || "Text Element"}
</p>`;
    }
    case "input": {
      structuralStyle = {
        borderColor: item.borderColor,
        fontSize: item.fontSize ? addPx(item.fontSize) : undefined,
      };
      const completeStyle = mergeStyles(structuralStyle, getCommonStyles(item));
      return `<input className="border rounded p-1" style={{ ${generateStyleString(
        completeStyle
      )} }} placeholder="Input Value" />`;
    }
    default:
      return `<div>Unknown Component</div>`;
  }
}
