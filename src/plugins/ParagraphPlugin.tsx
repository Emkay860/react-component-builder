// src/plugins/ParagraphPlugin.tsx
import React from "react";
import { PropertyField } from "../config/componentProperties";
import type { DroppedItem } from "../types";
import { getCommonStyles } from "../utils/commonStylesHelper";
import { generateStyleString } from "../utils/styleHelpers";
import type { ComponentPlugin } from "./ComponentPlugin";
import { pluginRegistry } from "./PluginRegistry";

// The render component for a basic <p> element.
const ParagraphRender: React.FC<React.PropsWithChildren<{ item: DroppedItem }>> = ({ item, children }) => {
  const style = {
    ...getCommonStyles(item),
    fontSize: item.fontSize ? `${item.fontSize}px` : "16px",
    color: item.textColor || "#000000",
  };
  return (
    <p style={style}>
      {item.label !== undefined ? item.label : "Paragraph Text"}
      {children}
    </p>
  );
};

// Code generator for a <p> element.
const generateParagraphMarkup = (item: DroppedItem, childrenMarkup: string = ""): string => {
  const style = {
    ...getCommonStyles(item),
    fontSize: item.fontSize ? `${item.fontSize}px` : "16px",
    color: item.textColor || "#000000",
  };
  const styleString = generateStyleString(style);
  return `<p style={{ ${styleString} }}>
  ${item.label !== undefined ? item.label : "Paragraph Text"}
  ${childrenMarkup}
</p>`;
};

// Define property fields for the Paragraph element.
const paragraphProperties: PropertyField[] = [
  { label: "Text", property: "label", type: "text", defaultValue: "Paragraph Text" },
  { label: "Font Size", property: "fontSize", type: "number", defaultValue: 16 },
  { label: "Text Color", property: "textColor", type: "color", defaultValue: "#000000" },
];

const ParagraphPlugin: ComponentPlugin = {
  type: "p",
  name: "Paragraph",
  properties: paragraphProperties,
  Render: ParagraphRender,
  generateMarkup: generateParagraphMarkup,
};

// Register the Paragraph plugin with the registry.
pluginRegistry.register(ParagraphPlugin);

export default ParagraphPlugin;
