// src/config/componentProperties.ts
import type { ComponentType, DroppedItem } from "../types";

export type PropertyField = {
  label: string;
  property: keyof DroppedItem; // Key on DroppedItem that will update the value
  type: "text" | "number" | "color" | "boolean";
  defaultValue?: string | number | boolean;
};

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
  ],
};
