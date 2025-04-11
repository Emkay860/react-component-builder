// src/types.ts
export type ComponentType =
  | "button"
  | "card"
  | "text"
  | "input"
  | "div"
  | "section"
  | "a";

export interface DroppedItem {
  id: string;
  x: number;
  y: number;
  zIndex?: number;
  componentType: ComponentType;
  label?: string;
  // Extra editable styling properties
  bgColor?: string;
  textColor?: string;
  borderRadius?: number;
  fontSize?: number;
  borderColor?: string;
  width?: number;
  height?: number;
  // New fields for container behavior
  isContainer?: boolean; // When true, this element can contain child elements.
  containerTag?: string; // Optional override for the HTML tag (e.g. "section", "div", etc.)
}
