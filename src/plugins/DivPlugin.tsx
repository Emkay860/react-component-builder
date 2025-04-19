// src/plugins/DivPlugin.tsx
import React from "react";
import { PropertyField } from "../config/componentProperties";
import type { DroppedItem } from "../types";
import { getCommonStyles } from "../utils/commonStylesHelper";
import { generateStyleString } from "../utils/styleHelpers";
import type { ComponentPlugin } from "./ComponentPlugin";
import { pluginRegistry } from "./PluginRegistry";

// The render component for a basic <div>.
const DivRender: React.FC<React.PropsWithChildren<{ item: DroppedItem }>> = ({ item, children }) => {
  const style = {
    width: item.width ? `${item.width}px` : "auto",
    height: item.height ? `${item.height}px` : "auto",
    ...getCommonStyles(item),
  };
  return (
    <div style={style}>
      {item.label !== undefined ? item.label : "Div Content"}
      {children}
    </div>
  );
};

// Code generator for a <div>.
const generateDivMarkup = (item: DroppedItem, childrenMarkup: string = ""): string => {
  const style = {
    width: item.width ? `${item.width}px` : "auto",
    height: item.height ? `${item.height}px` : "auto",
    ...getCommonStyles(item),
  };
  const styleString = generateStyleString(style);
  return `<div style={{ ${styleString} }}>
  ${item.label !== undefined ? item.label : "Div Content"}
  ${childrenMarkup}
</div>`;
};

// Define property fields for the Div element.
const divProperties: PropertyField[] = [
  { label: "Content", property: "label", type: "text", defaultValue: "Div Content" },
  { label: "Width", property: "width", type: "number", defaultValue: 300 },
  { label: "Height", property: "height", type: "number", defaultValue: 200 },
];

const DivPlugin: ComponentPlugin = {
  type: "div",
  name: "Div",
  properties: divProperties,
  Render: DivRender,
  generateMarkup: generateDivMarkup,
};

// Register the Div plugin with the registry.
pluginRegistry.register(DivPlugin);

export default DivPlugin;
