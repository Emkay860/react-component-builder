// src/config/componentProperties.ts
import type { ComponentType, DroppedItem } from "../types";

export type PropertyField = {
  label: string;
  property: keyof DroppedItem; // key on DroppedItem that will update the value
  type: "text" | "number" | "color" | "boolean";
};

export const componentProperties: Partial<
  Record<ComponentType, PropertyField[]>
> = {
  button: [
    { label: "Label", property: "label", type: "text" },
    { label: "Background Color", property: "bgColor", type: "color" },
    { label: "Text Color", property: "textColor", type: "color" },
    { label: "Border Radius", property: "borderRadius", type: "number" },
    { label: "Font Size", property: "fontSize", type: "number" },
  ],
  text: [
    { label: "Text", property: "label", type: "text" },
    { label: "Text Color", property: "textColor", type: "color" },
    { label: "Font Size", property: "fontSize", type: "number" },
  ],
  card: [
    { label: "Title", property: "label", type: "text" },
    { label: "Background Color", property: "bgColor", type: "color" },
    { label: "Border Radius", property: "borderRadius", type: "number" },
    { label: "Font Size", property: "fontSize", type: "number" },
    // New controls to update the size of the card:
    { label: "Width", property: "width", type: "number" },
    { label: "Height", property: "height", type: "number" },
  ],
  input: [
    { label: "Placeholder", property: "label", type: "text" },
    { label: "Border Color", property: "borderColor", type: "color" },
    { label: "Font Size", property: "fontSize", type: "number" },
  ],
};
