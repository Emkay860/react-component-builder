// src/plugins/CardPlugin.tsx
import React from "react";
import { PropertyField, commonCssProperties } from "../config/componentProperties";
import type { DroppedItem } from "../types";
import { getCommonStyles } from "../utils/commonStylesHelper";
import { addPx, generateStyleString } from "../utils/styleHelpers";
import type { ComponentPlugin } from "./ComponentPlugin";
import { pluginRegistry } from "./PluginRegistry";

// Define a default style object for cards.
const defaultStyle: React.CSSProperties = {
  borderRadius: "0.5rem",           // Rounded corners
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)", // Subtle shadow
  width: "300px",                   // Default width
  height: "200px",                  // Default height
  backgroundColor: "#ffffff",       // Default background color
  border: "2px solid #000",             // Default black border
};

// The React component for rendering a Card.
// It accepts children so that nested items (if any) can be rendered.
const CardRender: React.FC<React.PropsWithChildren<{ item: DroppedItem }>> = ({ item, children }) => {
    // First, gather common styles.
    const common = getCommonStyles(item);

  const style: React.CSSProperties = {
    // Merge any common styles.
    ...common,
    // Use provided width/height or default (overwritten by dynamic props if provided)
    width: item.width ? `${item.width}px` : defaultStyle.width,
    height: item.height ? `${item.height}px` : defaultStyle.height,
    // Allow a custom backgroundColor, falling back to the default white.
    backgroundColor: item.backgroundColor || defaultStyle.backgroundColor,
    // Use provided borderRadius if set; otherwise, use our default rounded style.
    borderRadius: item.borderRadius ? addPx(item.borderRadius) : defaultStyle.borderRadius,
    // If a fontSize is provided, use it.
    fontSize: item.fontSize ? addPx(item.fontSize) : undefined,
    // Merge our defaultBoxShadow (unless overridden by common styles)
    boxShadow: item.boxShadow || defaultStyle.boxShadow,
    border: item.borderColor ? `1px solid ${item.borderColor}` : defaultStyle.border,
  };

  return (
    <div style={style}>
      {item.label }
      {children}
    </div>
  );
};

// Code generator for Card.
// It creates a style object using default values that can be overwritten.
const generateCardMarkup = (item: DroppedItem): string => {
  const style = {
    width: item.width ? `${item.width}px` : defaultStyle.width,
    height: item.height ? `${item.height}px` : defaultStyle.height,
    backgroundColor: item.backgroundColor || defaultStyle.backgroundColor,
    borderRadius: item.borderRadius ? addPx(item.borderRadius) : defaultStyle.borderRadius,
    fontSize: item.fontSize ? addPx(item.fontSize) : undefined,
    boxShadow: item.boxShadow || defaultStyle.boxShadow,
    ...getCommonStyles(item),
  };

  const styleString = generateStyleString(style);

  return `<div style={{ ${styleString} }}>
  ${item.label}
</div>`;
};

const cardProperties: PropertyField[] = [
  { label: "Label", property: "label", type: "text", defaultValue: "Card Title" },
  { label: "isContainer", property: "isContainer", type: "boolean", defaultValue: true },
];

const mergedCardProperties: PropertyField[] = [
  ...cardProperties,
  ...commonCssProperties.filter(
    (field: PropertyField) => !cardProperties.some((f) => f.property === field.property)
  ),
];

const CardPlugin: ComponentPlugin = {
  type: "card",
  name: "Card",
  properties: mergedCardProperties,
  Render: CardRender,
  generateMarkup: generateCardMarkup,
};

pluginRegistry.register(CardPlugin);

export default CardPlugin;
