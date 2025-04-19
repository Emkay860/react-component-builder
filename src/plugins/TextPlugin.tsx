// src/plugins/TextPlugin.tsx
import React from "react";
import { PropertyField } from "../config/componentProperties";
import type { DroppedItem } from "../types";
import { getCommonStyles } from "../utils/commonStylesHelper";
import { generateStyleString } from "../utils/styleHelpers";
import type { ComponentPlugin } from "./ComponentPlugin";
import { pluginRegistry } from "./PluginRegistry";

// Render component for a text element.
// Here we use a <span> for inline text, but you can change it to <p> if needed.
const TextRender: React.FC<React.PropsWithChildren<{ item: DroppedItem }>> = ({ item, children }) => {
  const style = {
    fontSize: item.fontSize ? `${item.fontSize}px` : "16px",
    color: item.textColor || "#000000",
    ...getCommonStyles(item),
  };
  return (
    <span style={style}>
      {item.label !== undefined ? item.label : "Text Element"}
      {children}
    </span>
  );
};

// Code generator for a text element.
const generateTextMarkup = (item: DroppedItem, childrenMarkup: string = ""): string => {
  const style = {
    fontSize: item.fontSize ? `${item.fontSize}px` : "16px",
    color: item.textColor || "#000000",
    ...getCommonStyles(item),
  };
  const styleString = generateStyleString(style);
  return `<span style={{ ${styleString} }}>
  ${item.label !== undefined ? item.label : "Text Element"}
  ${childrenMarkup}
</span>`;
};

// Define property fields for the Text element.
const textProperties: PropertyField[] = [
  { label: "Text", property: "label", type: "text", defaultValue: "Text Element" },
  { label: "Font Size", property: "fontSize", type: "number", defaultValue: 16 },
  { label: "Text Color", property: "textColor", type: "color", defaultValue: "#000000" },
];

const TextPlugin: ComponentPlugin = {
  type: "text",
  name: "Text",
  properties: textProperties,
  Render: TextRender,
  generateMarkup: generateTextMarkup,
};

// Register the Text plugin.
pluginRegistry.register(TextPlugin);

export default TextPlugin;
