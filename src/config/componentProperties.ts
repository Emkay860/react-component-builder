// src/config/componentProperties.ts
import type { ComponentType, DroppedItem } from "../types";

export type PropertyField = {
  label: string;
  property: keyof DroppedItem; // a key on DroppedItem
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
  ],
  input: [
    { label: "Placeholder", property: "label", type: "text" },
    { label: "Border Color", property: "borderColor", type: "color" },
    { label: "Font Size", property: "fontSize", type: "number" },
  ],
};
