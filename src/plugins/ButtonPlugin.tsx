// src/plugins/ButtonPlugin.tsx
import React from "react";
import { PropertyField, commonCssProperties } from "../config/componentProperties";
import type { DroppedItem } from "../types";
import { getCommonStyles } from "../utils/commonStylesHelper";
import { addPx, generateStyleString } from "../utils/styleHelpers";
import type { ComponentPlugin } from "./ComponentPlugin";
import { pluginRegistry } from "./PluginRegistry";

// The React component for rendering a Button now accepts children.
const ButtonRender: React.FC<React.PropsWithChildren<{ item: DroppedItem }>> = ({ item, children }) => {
  const style = {
    width: item.width ? `${item.width}px` : "auto",
    height: item.height ? `${item.height}px` : "auto",
    backgroundColor: item.backgroundColor,
    color: item.textColor,
    borderRadius: item.borderRadius ? addPx(item.borderRadius) : undefined,
    fontSize: item.fontSize ? addPx(item.fontSize) : undefined,
    ...getCommonStyles(item),
  };
  return (
    <button style={style}>
      {item.label || "Button"}
      {children}
    </button>
  );
};

// Code generator for Button.
const generateButtonMarkup = (item: DroppedItem): string => {
  const style = {
    width: item.width ? `${item.width}px` : "auto",
    height: item.height ? `${item.height}px` : "auto",
    backgroundColor: item.backgroundColor,
    color: item.textColor,
    borderRadius: item.borderRadius ? addPx(item.borderRadius) : undefined,
    fontSize: item.fontSize ? addPx(item.fontSize) : undefined,
    ...getCommonStyles(item),
  };
  const styleString = generateStyleString(style);
  return `<button style={{ ${styleString} }}>
  ${item.label || "Button"}
</button>`;
};

const buttonProperties: PropertyField[] = [
  { label: "Label", property: "label", type: "text", defaultValue: "Button" },
  { label: "Text Color", property: "textColor", type: "color", defaultValue: "#ffffff" },
  { label: "Disabled", property: "disabled", type: "boolean", defaultValue: false },
  { label: "Font Size", property: "fontSize", type: "number", defaultValue: 16 },
  { label: "Font Weight", property: "fontWeight", type: "text", defaultValue: "bold" },
  { label: "isContainer", property: "isContainer", type: "boolean", defaultValue: false },
];

// Merge with commonCssProperties, avoiding duplicates
const mergedButtonProperties: PropertyField[] = [
  ...buttonProperties,
  ...commonCssProperties.filter(
    (field: PropertyField) => !buttonProperties.some((f) => f.property === field.property)
  ),
];

const ButtonPlugin: ComponentPlugin = {
  type: "button",
  name: "Button",
  properties: mergedButtonProperties,
  Render: ButtonRender,
  generateMarkup: generateButtonMarkup,
};

// Automatically register this plugin.
pluginRegistry.register(ButtonPlugin);

export default ButtonPlugin;
