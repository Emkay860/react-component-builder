// types.ts
export type ComponentType = "button" | "card" | "text" | "input";

export interface DroppedItem {
  id: string;
  x: number;
  y: number;
  zIndex?: number;
  componentType: ComponentType;
  label?: string;
  // Additional properties for buttons (and you can extend to other types)
  bgColor?: string; // E.g. Background color of the button
  textColor?: string; // E.g. Text color
  borderRadius?: number; // E.g. Border radius in pixels
  fontSize?: number; // E.g. Font size in pixels
}
