import { getCommonStyles } from "../../utils/commonStylesHelper";
import { DroppedItemRendererProps } from "../DroppedItemRenderer";

export const ButtonRenderer: React.FC<DroppedItemRendererProps> = ({ item }) => {
  return (
    <button
      className=""
      style={{
        width: item.width ? `${item.width}px` : "auto",
        height: item.height ? `${item.height}px` : "auto",
        backgroundColor: item.backgroundColor,
        color: item.textColor,
        borderRadius: item.borderRadius ? `${item.borderRadius}px` : undefined,
        fontSize: item.fontSize ? `${item.fontSize}px` : undefined,
        ...getCommonStyles(item),
      }}
    >
      {item.label || "Button"}
    </button>
  );
};
