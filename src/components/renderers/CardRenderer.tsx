//src/components/renderers/CardRenderer.tsx

import { getCommonStyles } from "../../utils/commonStylesHelper";
import { DroppedItemRendererProps } from "../DroppedItemRenderer";

export const CardRenderer: React.FC<DroppedItemRendererProps> = ({
  item,
  children,
}) => {
  return (
    <div
      className="p-4"
      style={{
        width: item.width ? `${item.width}px` : "auto",
        height: item.height ? `${item.height}px` : "auto",
        backgroundColor: item.backgroundColor,
        borderRadius: item.borderRadius ? `${item.borderRadius}px` : undefined,
        fontSize: item.fontSize ? `${item.fontSize}px` : undefined,
        ...getCommonStyles(item),
      }}
    >
      {item.label || "Card Component"}
      {children}
    </div>
  );
};
