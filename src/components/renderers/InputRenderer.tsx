//src/components/renderers/InputRenderer.tsx
import { getCommonStyles } from "../../utils/commonStylesHelper";
import { DroppedItemRendererProps } from "../DroppedItemRenderer";

export const InputRenderer: React.FC<DroppedItemRendererProps> = ({ item }) => {
  return (
    <input
      className=""
      style={{
        borderColor: item.borderColor,
        fontSize: item.fontSize ? `${item.fontSize}px` : undefined,
        ...getCommonStyles(item),
      }}
      placeholder="Input Value"
    />
  );
};
