// src/utils/commonStylesHelper.ts

import { DroppedItem } from "../types";
import { commonCssProperties } from "../config/componentProperties";

// Build common CSS styles from additional properties.
export const getCommonStyles = (item: DroppedItem): React.CSSProperties => {
  const styles: React.CSSProperties = {};
  for (const field of commonCssProperties) {
    const value = item[field.property];
    if (value !== undefined && value !== "") {
      // Only assign if the property is a valid CSS property
      const cssProp = field.property as keyof React.CSSProperties;
      // Handle px suffix for number-based CSS properties
      if (
        ["width", "height", "borderWidth", "borderRadius", "fontSize"].includes(
          field.property
        ) &&
        typeof value === "number"
      ) {
        (styles as any)[cssProp] = `${value}px`;
      } else {
        (styles as any)[cssProp] = value;
      }
    }
  }
  return styles;
};
