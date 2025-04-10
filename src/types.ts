export type ComponentType = "button" | "card" | "text" | "input";

export interface DroppedItem {
  id: string;
  x: number;
  y: number;
  zIndex?: number;
  componentType: ComponentType;
  label?: string;
  // Extra editable properties (for button, card, text, input, etc.)
  bgColor?: string;
  textColor?: string;
  borderRadius?: number;
  fontSize?: number;
  borderColor?: string; // For input, for example
}
