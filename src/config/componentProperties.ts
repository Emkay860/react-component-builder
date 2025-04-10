// src/config/componentProperties.ts
import type { ComponentType, DroppedItem } from "../types";

export type PropertyField = {
  label: string;
  property: keyof DroppedItem; // a property key in DroppedItem
  type: "text" | "number" | "color" | "boolean";
};

export const componentProperties: Partial<Record<ComponentType, PropertyField[]>> = {
  button: [
    { label: "Label", property: "label", type: "text" },
    { label: "Background Color", property: "bgColor", type: "color" },
    { label: "Text Color", property: "textColor", type: "color" },
    { label: "Border Radius", property: "borderRadius", type: "number" },
    { label: "Font Size", property: "fontSize", type: "number" },
  ],
  text: [{ label: "Label", property: "label", type: "text" }],
  card: [
    // Add card-specific fields if needed.
  ],
  input: [
    // Add input-specific fields if needed.
  ],
};
