// src/styles/componentStyles.ts
import type { ComponentType } from "../types";

const componentStyles: Record<
  ComponentType,
  {
    container: string;
    element: string;
    overlay?: string;
    elementWrapper?: string;
  }
> = {
  button: {
    container: "cursor-grab",
    // Include both a background-color and appearance reset
    element: "",
    overlay: "shadow opacity-75",
  },
  card: {
    container: "cursor-grab",
    element: "p-4 bg-white border rounded shadow",
  },
  text: {
    container: "cursor-grab",
    element: "p-2 text-red-800",
  },
  input: {
    container: "cursor-grab",
    elementWrapper: "p-1 hover:border hover:border-dashed hover:border-red-500",
    element: "border rounded p-1 text-black",
  },
};

export default componentStyles;
