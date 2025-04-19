// src/plugins/ImagePlugin.tsx
import React from "react";
import { PropertyField } from "../config/componentProperties";
import type { DroppedItem } from "../types";
import { generateStyleString } from "../utils/styleHelpers";
import type { ComponentPlugin } from "./ComponentPlugin";
import { pluginRegistry } from "./PluginRegistry";

// Render component for an image element.
const ImageRender: React.FC<React.PropsWithChildren<{ item: DroppedItem }>> = ({ item }) => {
  const style = {
    width: item.width ? `${item.width}px` : "auto",
    height: item.height ? `${item.height}px` : "auto",
  };
  return (
    <img
      src={item.src || "https://via.placeholder.com/150"}
      alt={item.alt || "Image"}
      style={style}
    />
  );
};

// Code generator for an image element.
const generateImageMarkup = (item: DroppedItem): string => {
  const style = {
    width: item.width ? `${item.width}px` : "auto",
    height: item.height ? `${item.height}px` : "auto",
  };
  const styleString = generateStyleString(style);
  return `<img src="${item.src || "https://via.placeholder.com/150"}" alt="${
    item.alt || "Image"
  }" style={{ ${styleString} }} />`;
};

// Define property fields for the Image element.
const imageProperties: PropertyField[] = [
  { label: "Image URL", property: "src", type: "text", defaultValue: "https://via.placeholder.com/150" },
  { label: "Alt Text", property: "alt", type: "text", defaultValue: "Image" },
  { label: "Width", property: "width", type: "number", defaultValue: 150 },
  { label: "Height", property: "height", type: "number", defaultValue: 150 },
];

const ImagePlugin: ComponentPlugin = {
  type: "image",
  name: "Image",
  properties: imageProperties,
  Render: ImageRender,
  generateMarkup: generateImageMarkup,
};

// Register the Image plugin.
pluginRegistry.register(ImagePlugin);

export default ImagePlugin;
