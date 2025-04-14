// src/config/componentProperties.ts
import type { ComponentType, DroppedItem } from "../types";

export type PropertyField = {
  label: string;
  property: keyof DroppedItem; // Key on DroppedItem that will update the value.
  type: "text" | "number" | "color" | "boolean";
  defaultValue?: string | number | boolean;
};

// Define common CSS properties for all components (excluding z-index).
const commonCssProperties: PropertyField[] = [
  { label: "Margin", property: "margin", type: "text", defaultValue: "0" },
  { label: "Padding", property: "padding", type: "text", defaultValue: "0" },
  {
    label: "Border Width",
    property: "borderWidth",
    type: "number",
    defaultValue: 0,
  },
  {
    label: "Border Style",
    property: "borderStyle",
    type: "text",
    defaultValue: "solid",
  },
  {
    label: "Border Color",
    property: "borderColor",
    type: "color",
    defaultValue: "#000000",
  },
  {
    label: "Box Shadow",
    property: "boxShadow",
    type: "text",
    defaultValue: "none",
  },
  { label: "Opacity", property: "opacity", type: "number", defaultValue: 1 },
  {
    label: "Font Family",
    property: "fontFamily",
    type: "text",
    defaultValue: "Arial, sans-serif",
  },
];

export const componentProperties: Partial<Record<ComponentType, PropertyField[]>> = {
  button: [
    { label: "Label", property: "label", type: "text", defaultValue: "Button" },
    {
      label: "Background Color",
      property: "bgColor",
      type: "color",
      defaultValue: "#3B82F6",
    },
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
    ...commonCssProperties,
  ],
  text: [
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
    ...commonCssProperties,
  ],
  card: [
    {
      label: "Title",
      property: "label",
      type: "text",
      defaultValue: "Card Component",
    },
    {
      label: "Background Color",
      property: "bgColor",
      type: "color",
      defaultValue: "#ffffff",
    },
    {
      label: "Border Radius",
      property: "borderRadius",
      type: "number",
      defaultValue: 8,
    },
    {
      label: "Font Size",
      property: "fontSize",
      type: "number",
      defaultValue: 16,
    },
    { label: "Width", property: "width", type: "number", defaultValue: 300 },
    { label: "Height", property: "height", type: "number", defaultValue: 200 },
    {
      label: "Container",
      property: "isContainer",
      type: "boolean",
      defaultValue: false,
    },
    ...commonCssProperties,
  ],
  input: [
    {
      label: "Placeholder",
      property: "label",
      type: "text",
      defaultValue: "Input Value",
    },
    {
      label: "Border Color",
      property: "borderColor",
      type: "color",
      defaultValue: "#D1D5DB",
    },
    {
      label: "Font Size",
      property: "fontSize",
      type: "number",
      defaultValue: 16,
    },
    ...commonCssProperties,
  ],
  // You may extend properties for "div", "section", or "a" similarly if needed.
};
