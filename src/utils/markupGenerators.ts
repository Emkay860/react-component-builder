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
 * Helper to get container structural styles based on the new layoutMode.
 * - If layoutMode is "flex": returns a flex container style.
 * - If layoutMode is "grid": returns a grid container style.
 * - Otherwise (or if layoutMode is "absolute" or undefined): returns a default (relative/absolute) style.
 */
function getContainerStructuralStyles(item: DroppedItem): {
  [key: string]: string | undefined;
} {
  if (item.layoutMode === "flex") {
    return {
      display: "flex",
      justifyContent: item.justifyContent || "flex-start",
      alignItems: item.alignItems || "flex-start",
      gap: "10px",
      padding: "16px",
      borderRadius: item.borderRadius ? addPx(item.borderRadius) : undefined,
      fontSize: item.fontSize ? addPx(item.fontSize) : undefined,
      width: item.width ? addPx(item.width) : "auto",
      height: item.height ? addPx(item.height) : "auto",
      backgroundColor: item.backgroundColor,
    };
  } else if (item.layoutMode === "grid") {
    return {
      display: "grid",
      gridTemplateColumns: `repeat(${item.columnSpan || 1}, 1fr)`,
      gap: "10px",
      padding: "16px",
      borderRadius: item.borderRadius ? addPx(item.borderRadius) : undefined,
      fontSize: item.fontSize ? addPx(item.fontSize) : undefined,
      width: item.width ? addPx(item.width) : "auto",
      height: item.height ? addPx(item.height) : "auto",
      backgroundColor: item.backgroundColor,
    };
  } else {
    // Default to absolute/relative positioning for containers.
    return {
      position: "relative",
      borderRadius: item.borderRadius ? addPx(item.borderRadius) : undefined,
      fontSize: item.fontSize ? addPx(item.fontSize) : undefined,
      width: item.width ? addPx(item.width) : "auto",
      height: item.height ? addPx(item.height) : "auto",
      backgroundColor: item.backgroundColor,
    };
  }
}

/**
 * Generate markup for a container element.
 */
export function containerMarkup(
  item: DroppedItem,
  childrenMarkup: string
): string {
  // Use getContainerStructuralStyles to generate container styles based on layoutMode.
  const structuralStyle = getContainerStructuralStyles(item);

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
        backgroundColor: item.backgroundColor,
      };
      {
        const tag = item.containerTag || "div";
        // If a layoutMode is defined and not "absolute", use the container structural styles; otherwise, fall back to absolute positioning.
        const styleObj =
          item.layoutMode && item.layoutMode !== "absolute"
            ? getContainerStructuralStyles(item)
            : {
                ...structuralStyle,
                position: "absolute",
                top: `${item.y}px`,
                left: `${item.x}px`,
              };
        const completeStyle = mergeStyles(styleObj, getCommonStyles(item));
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
        backgroundColor: item.backgroundColor,
        color: item.textColor,
      };
      {
        const styleObj =
          item.layoutMode && item.layoutMode !== "absolute"
            ? getContainerStructuralStyles(item)
            : {
                ...structuralStyle,
                position: "absolute",
                top: `${item.y}px`,
                left: `${item.x}px`,
              };
        const completeStyle = mergeStyles(styleObj, getCommonStyles(item));
        return `<button className="bg-black text-white px-4 py-2 rounded" style={{ ${generateStyleString(
          completeStyle
        )} }}>
  ${item.label !== undefined ? item.label : "Button"}
</button>`;
      }
    }
    case "text": {
      structuralStyle = {
        fontSize: item.fontSize ? addPx(item.fontSize) : undefined,
        color: item.textColor,
      };
      {
        const styleObj =
          item.layoutMode && item.layoutMode !== "absolute"
            ? getContainerStructuralStyles(item)
            : {
                ...structuralStyle,
                position: "absolute",
                top: `${item.y}px`,
                left: `${item.x}px`,
              };
        const completeStyle = mergeStyles(styleObj, getCommonStyles(item));
        return `<p className="text-gray-400" style={{ ${generateStyleString(
          completeStyle
        )} }}>
  ${item.label || "Text Element"}
</p>`;
      }
    }
    case "input": {
      structuralStyle = {
        borderColor: item.borderColor,
        fontSize: item.fontSize ? addPx(item.fontSize) : undefined,
      };
      {
        const styleObj =
          item.layoutMode && item.layoutMode !== "absolute"
            ? getContainerStructuralStyles(item)
            : {
                ...structuralStyle,
                position: "absolute",
                top: `${item.y}px`,
                left: `${item.x}px`,
              };
        const completeStyle = mergeStyles(styleObj, getCommonStyles(item));
        return `<input className="border rounded p-1" style={{ ${generateStyleString(
          completeStyle
        )} }} placeholder="Input Value" />`;
      }
    }
    default:
      return `<div>Unknown Component</div>`;
  }
}
