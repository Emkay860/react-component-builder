// src/config/componentProperties.ts
import type { DroppedItem } from "../types";

export type PropertyField = {
  label: string;
  property: keyof DroppedItem; // Key on DroppedItem that will update the value.
  type: "text" | "number" | "color" | "boolean";
  defaultValue?: string | number | boolean;
};

// Define common CSS properties for all components.
export const commonCssProperties: PropertyField[] = [
  { label: "Margin", property: "margin", type: "text", defaultValue: "0" },
  { label: "Padding", property: "padding", type: "text", defaultValue: "0" },
  { label: "Border Width", property: "borderWidth", type: "number", defaultValue: 0 },
  { label: "Border Style", property: "borderStyle", type: "text", defaultValue: "solid" },
  { label: "Border Color", property: "borderColor", type: "color", defaultValue: "#000000" },
  { label: "Box Shadow", property: "boxShadow", type: "text", defaultValue: "none" },
  { label: "Opacity", property: "opacity", type: "number", defaultValue: 1 },
  { label: "Font Family", property: "fontFamily", type: "text", defaultValue: "Arial, sans-serif" },
  { label: "Background Color", property: "backgroundColor", type: "color", defaultValue: "#ffffff" },
  { label: "Width", property: "width", type: "number", defaultValue: 200 },
  { label: "Height", property: "height", type: "number", defaultValue: 100 },
  { label: "Border Radius", property: "borderRadius", type: "number", defaultValue: 4 },
];
