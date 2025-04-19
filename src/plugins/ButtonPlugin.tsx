// src/plugins/ButtonPlugin.tsx
import React from "react";
import { PropertyField } from "../config/componentProperties";
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
  { label: "Border Radius", property: "borderRadius", type: "number", defaultValue: 4 },
  { label: "Font Size", property: "fontSize", type: "number", defaultValue: 14 },
  { label: "Width", property: "width", type: "number", defaultValue: 120 },
  { label: "Height", property: "height", type: "number", defaultValue: 40 },
];

const ButtonPlugin: ComponentPlugin = {
  type: "button",
  name: "Button",
  properties: buttonProperties,
  Render: ButtonRender,
  generateMarkup: generateButtonMarkup,
};

// Automatically register this plugin.
pluginRegistry.register(ButtonPlugin);

export default ButtonPlugin;
