//src/components/renderers/TextRenderer.tsx

import { getCommonStyles } from "../../utils/commonStylesHelper";
import { DroppedItemRendererProps } from "../DroppedItemRenderer";

export const TextRenderer: React.FC<DroppedItemRendererProps> = ({ item }) => {
  return (
    <p
      className=""
      style={{
        fontSize: item.fontSize ? `${item.fontSize}px` : undefined,
        color: item.textColor,
        ...getCommonStyles(item),
      }}
    >
      {item.label || "Text Element"}
    </p>
  );
};
