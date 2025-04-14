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
  bgColor?: string;
  textColor?: string;
  borderRadius?: number;
  fontSize?: number;
  borderColor?: string;
  width?: number;
  height?: number;
  isContainer?: boolean;
  containerTag?: string;
  parentId?: string; // Indicates the parent container's id.

  // Additional common CSS properties.
  margin?: string;
  padding?: string;
  borderWidth?: number;
  borderStyle?: string;
  boxShadow?: string;
  opacity?: number;
  fontFamily?: string;
}
