// src/utils/markupGenerators.ts
import type { DroppedItem } from "../types";
import { addPx, generateStyleString } from "./styleHelpers";

function getAdditionalStyles(item: DroppedItem): {
  [key: string]: string | undefined;
} {
  const styles: { [key: string]: string | undefined } = {};
  if (item.margin) styles.margin = item.margin;
  if (item.padding) styles.padding = item.padding;
  if (item.borderWidth !== undefined)
    styles.borderWidth = addPx(item.borderWidth);
  if (item.borderStyle) styles.borderStyle = item.borderStyle;
  if (item.borderColor) styles.borderColor = item.borderColor;
  if (item.boxShadow) styles.boxShadow = item.boxShadow;
  if (item.opacity !== undefined) styles.opacity = String(item.opacity);
  if (item.fontFamily) styles.fontFamily = item.fontFamily;
  if (item.zIndex !== undefined) styles.zIndex = String(item.zIndex);
  return styles;
}

export function containerMarkup(
  item: DroppedItem,
  childrenMarkup: string
): string {
  const baseStyle: { [key: string]: string | undefined } = {
    position: "relative",
    borderRadius: item.borderRadius ? addPx(item.borderRadius) : undefined,
    fontSize: item.fontSize ? addPx(item.fontSize) : undefined,
    width: item.width ? addPx(item.width) : "auto",
    height: item.height ? addPx(item.height) : "auto",
    backgroundColor: item.bgColor,
  };

  // Merge in additional custom CSS properties.
  const completeStyle = { ...baseStyle, ...getAdditionalStyles(item) };

  const tag = item.containerTag || "div";
  return `<${tag} className="p-4 rounded shadow bg-gray-800 text-white" style={{ ${generateStyleString(
    completeStyle
  )} }}>
  ${item.label !== undefined ? item.label : "Card Component"}
  ${childrenMarkup}
</${tag}>`;
}

export function elementMarkup(item: DroppedItem): string {
  let baseStyle: { [key: string]: string | undefined } = {};
  switch (item.componentType) {
    case "card": {
      baseStyle = {
        borderRadius: item.borderRadius ? addPx(item.borderRadius) : undefined,
        fontSize: item.fontSize ? addPx(item.fontSize) : undefined,
        width: item.width ? addPx(item.width) : "auto",
        height: item.height ? addPx(item.height) : "auto",
        backgroundColor: item.bgColor,
      };
      {
        const completeStyle = { ...baseStyle, ...getAdditionalStyles(item) };
        const tag = item.containerTag || "div";
        return `<${tag} className="p-4 rounded shadow bg-gray-800 text-white" style={{ ${generateStyleString(
          completeStyle
        )} }}>
  ${item.label !== undefined ? item.label : "Card Component"}
</${tag}>`;
      }
    }
    case "button": {
      baseStyle = {
        borderRadius: item.borderRadius ? addPx(item.borderRadius) : undefined,
        fontSize: item.fontSize ? addPx(item.fontSize) : undefined,
        width: item.width ? addPx(item.width) : "auto",
        height: item.height ? addPx(item.height) : "auto",
        backgroundColor: item.bgColor,
        color: item.textColor,
      };
      const completeStyle = { ...baseStyle, ...getAdditionalStyles(item) };
      return `<button className="bg-black text-white px-4 py-2 rounded" style={{ ${generateStyleString(
        completeStyle
      )} }}>
  ${item.label !== undefined ? item.label : "Button"}
</button>`;
    }
    case "text": {
      baseStyle = {
        fontSize: item.fontSize ? addPx(item.fontSize) : undefined,
        color: item.textColor,
      };
      const completeStyle = { ...baseStyle, ...getAdditionalStyles(item) };
      return `<p className="text-gray-400" style={{ ${generateStyleString(
        completeStyle
      )} }}>
  ${item.label || "Text Element"}
</p>`;
    }
    case "input": {
      baseStyle = {
        borderColor: item.borderColor,
        fontSize: item.fontSize ? addPx(item.fontSize) : undefined,
      };
      const completeStyle = { ...baseStyle, ...getAdditionalStyles(item) };
      return `<input className="border rounded p-1" style={{ ${generateStyleString(
        completeStyle
      )} }} placeholder="Input Value" />`;
    }
    default:
      return `<div>Unknown Component</div>`;
  }
}
