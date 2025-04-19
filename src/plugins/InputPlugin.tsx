// src/plugins/InputPlugin.tsx
import React from "react";
import { PropertyField } from "../config/componentProperties";
import type { DroppedItem } from "../types";
import { getCommonStyles } from "../utils/commonStylesHelper";
import { addPx, generateStyleString } from "../utils/styleHelpers";
import type { ComponentPlugin } from "./ComponentPlugin";
import { pluginRegistry } from "./PluginRegistry";

// Define default styles for the input element.
const defaultInputStyle: React.CSSProperties = {
  width: "200px",                       // Default width
  height: "40px",                       // Default height
  border: "2px solid #000",             // Default black border
  borderRadius: "4px",                  // Rounded corners
  padding: "0.25rem 0.5rem",            // Some padding
  backgroundColor: "#fff",              // White background
};

// The React component for rendering an Input element.
const InputRender: React.FC<React.PropsWithChildren<{ item: DroppedItem }>> = ({ item }) => {
  // First, gather common styles.
  const common = getCommonStyles(item);
  
  // Then, define our explicit styles that should override common styles.
  const style: React.CSSProperties = {
    ...common,
    width: item.width ? `${item.width}px` : defaultInputStyle.width,
    height: item.height ? `${item.height}px` : defaultInputStyle.height,
    // Note: we set border explicitly so it won’t be overridden by common styles.
    border: item.borderColor ? `1px solid ${item.borderColor}` : defaultInputStyle.border,
    borderRadius: item.borderRadius ? addPx(item.borderRadius) : defaultInputStyle.borderRadius,
    padding: defaultInputStyle.padding,
    backgroundColor: item.backgroundColor || defaultInputStyle.backgroundColor,
  };

  return (
    <input
      placeholder={item.label || "Input Value"}
      style={style}
    />
  );
};

// Code generator for the Input element.
const generateInputMarkup = (item: DroppedItem): string => {
  const common = getCommonStyles(item);
  const style = {
    ...common,
    width: item.width ? `${item.width}px` : defaultInputStyle.width,
    height: item.height ? `${item.height}px` : defaultInputStyle.height,
    border: item.borderColor ? `1px solid ${item.borderColor}` : defaultInputStyle.border,
    borderRadius: item.borderRadius ? addPx(item.borderRadius) : defaultInputStyle.borderRadius,
    padding: defaultInputStyle.padding,
    backgroundColor: item.backgroundColor || defaultInputStyle.backgroundColor,
  };
  const styleString = generateStyleString(style);
  return `<input placeholder="${item.label || "Input Value"}" style={{ ${styleString} }} />`;
};

// Define property fields for the Input element.
const inputProperties: PropertyField[] = [
  { label: "Placeholder", property: "label", type: "text", defaultValue: "Input Value" },
  { label: "Width", property: "width", type: "number", defaultValue: 200 },
  { label: "Height", property: "height", type: "number", defaultValue: 40 },
];

const InputPlugin: ComponentPlugin = {
  type: "input",
  name: "Input",
  properties: inputProperties,
  Render: InputRender,
  generateMarkup: generateInputMarkup,
};

// Automatically register the Input plugin.
pluginRegistry.register(InputPlugin);

export default InputPlugin;
