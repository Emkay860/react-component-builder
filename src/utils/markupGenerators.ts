// src/utils/markupGenerators.ts
import type { DroppedItem } from "../types";
import { addPx, generateStyleString } from "./styleHelpers";

/**
 * Generates the markup for a container item.
 * It wraps the container’s own content and its children.
 */
export function containerMarkup(item: DroppedItem, childrenMarkup: string): string {
  const styleObj: { [key: string]: string | undefined } = {
    position: "relative", // Ensures absolutely positioned children are referenced relatively.
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

/**
 * Generates the markup for a non-container item.
 * Returns the element markup as a string.
 */
export function elementMarkup(item: DroppedItem): string {
  let styleObj: { [key: string]: string | undefined } = {};
  switch (item.componentType) {
    case "card": {
      styleObj = {
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
