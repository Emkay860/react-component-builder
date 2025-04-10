// src/config/componentProperties.ts
import type { ComponentType, DroppedItem } from "../types";

export type PropertyField = {
  label: string;
  property: keyof DroppedItem; // key in DroppedItem that this field will update
  type: "text" | "number" | "color" | "boolean";
};

export const componentProperties: Partial<Record<ComponentType, PropertyField[]>> = {
  button: [
    { label: "Label", property: "label", type: "text" },
    // Add button-specific properties as needed
  ],
  text: [
    { label: "Label", property: "label", type: "text" },
  ],
  // For card, input, or other components you can define additional fields.
  // Leaving an empty array will simply mean no component-specific properties.
  card: [],
  input: [],
};
