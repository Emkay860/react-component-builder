// src/plugins/CardPlugin.tsx
import React from "react";
import { PropertyField } from "../config/componentProperties";
import type { DroppedItem } from "../types";
import { getCommonStyles } from "../utils/commonStylesHelper";
import { addPx, generateStyleString } from "../utils/styleHelpers";
import type { ComponentPlugin } from "./ComponentPlugin";
import { pluginRegistry } from "./PluginRegistry";

const CardRender: React.FC<React.PropsWithChildren<{ item: DroppedItem }>> = ({ item, children }) => {
  const style = {
    width: item.width ? `${item.width}px` : "auto",
    height: item.height ? `${item.height}px` : "auto",
    backgroundColor: item.backgroundColor,
    borderRadius: item.borderRadius ? addPx(item.borderRadius) : undefined,
    fontSize: item.fontSize ? addPx(item.fontSize) : undefined,
    ...getCommonStyles(item),
  };
  return (
    <div style={style}>
      {item.label || "Card Component"}
      {children}
    </div>
  );
};

const generateCardMarkup = (item: DroppedItem, childrenMarkup: string = ""): string => {
  const style = {
    width: item.width ? `${item.width}px` : "auto",
    height: item.height ? `${item.height}px` : "auto",
    backgroundColor: item.backgroundColor,
    borderRadius: item.borderRadius ? addPx(item.borderRadius) : undefined,
    fontSize: item.fontSize ? addPx(item.fontSize) : undefined,
    ...getCommonStyles(item),
  };
  const styleString = generateStyleString(style);
  return `<div style={{ ${styleString} }}>
  ${item.label || "Card Component"}
  ${childrenMarkup}
</div>`;
};

const cardProperties: PropertyField[] = [
  { label: "Title", property: "label", type: "text", defaultValue: "Card Component" },
  { label: "Border Radius", property: "borderRadius", type: "number", defaultValue: 8 },
  { label: "Font Size", property: "fontSize", type: "number", defaultValue: 16 },
  { label: "Width", property: "width", type: "number", defaultValue: 300 },
  { label: "Height", property: "height", type: "number", defaultValue: 200 },
];

const CardPlugin: ComponentPlugin = {
  type: "card",
  name: "Card",
  properties: cardProperties,
  Render: CardRender,
  generateMarkup: generateCardMarkup,
};

pluginRegistry.register(CardPlugin);

export default CardPlugin;
