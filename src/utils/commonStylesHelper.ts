// src/utils/commonStylesHelper.ts

import { DroppedItem } from "../types";

  // Build common CSS styles from additional properties.
 export const getCommonStyles = (item: DroppedItem): React.CSSProperties => ({
    margin: item.margin || undefined,
    padding: item.padding || undefined,
    borderWidth:
      item.borderWidth !== undefined ? `${item.borderWidth}px` : undefined,
    borderStyle: item.borderStyle || undefined,
    borderColor: item.borderColor || undefined,
    boxShadow: item.boxShadow || undefined,
    opacity: item.opacity,
    fontFamily: item.fontFamily || undefined,
    backgroundColor: item.backgroundColor,
  });
