// src/config/componentProperties.ts
import type { ComponentType, DroppedItem } from "../types";

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

/**
 * mergeWithCommonProperties takes a component's custom property fields and returns
 * a merged array where any common property that is already defined in the custom list
 * is filtered out.
 */
const mergeWithCommonProperties = (
  custom: PropertyField[]
): PropertyField[] => {
  const customKeys = new Set(custom.map((field) => field.property));
  const filteredCommon = commonCssProperties.filter(
    (field) => !customKeys.has(field.property)
  );
  return [...custom, ...filteredCommon];
};

export const componentProperties: Partial<Record<ComponentType, PropertyField[]>> = {
  button: mergeWithCommonProperties([
    { label: "Label", property: "label", type: "text", defaultValue: "Button" },
    // { label: "Background Color", property: "bgColor", type: "color", defaultValue: "#3B82F6" },
    {
      label: "Text Color",
      property: "textColor",
      type: "color",
      defaultValue: "#ffffff",
    },
    {
      label: "Border Radius",
      property: "borderRadius",
      type: "number",
      defaultValue: 4,
    },
    {
      label: "Font Size",
      property: "fontSize",
      type: "number",
      defaultValue: 14,
    },
    { label: "Width", property: "width", type: "number", defaultValue: 120 },
    { label: "Height", property: "height", type: "number", defaultValue: 40 },
  ]),
  text: mergeWithCommonProperties([
    {
      label: "Text",
      property: "label",
      type: "text",
      defaultValue: "Text Element",
    },
    {
      label: "Text Color",
      property: "textColor",
      type: "color",
      defaultValue: "#000000",
    },
    {
      label: "Font Size",
      property: "fontSize",
      type: "number",
      defaultValue: 16,
    },
  ]),
  card: mergeWithCommonProperties([
   
  ]),
  input: mergeWithCommonProperties([
    {
      label: "Placeholder",
      property: "label",
      type: "text",
      defaultValue: "Input Value",
    },
    // { label: "Border Color", property: "borderColor", type: "color", defaultValue: "#D1D5DB" },
    {
      label: "Font Size",
      property: "fontSize",
      type: "number",
      defaultValue: 16,
    },
  ]),
  // You may similarly extend properties for "div", "section", or "a" if needed.
};
