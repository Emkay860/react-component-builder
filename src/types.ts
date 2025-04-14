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
  backgroundColor?: string;

  // NEW: Layout Mode Properties for Option B
  layoutMode?: "absolute" | "flex" | "grid";
  justifyContent?:
    | "flex-start"
    | "center"
    | "flex-end"
    | "space-between"
    | "space-around";
  alignItems?: "flex-start" | "center" | "flex-end" | "stretch";
  columnSpan?: number; // Useful for grid layouts: number of desired columns.
}
