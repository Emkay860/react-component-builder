// src/components/GridBackground.tsx
import React from "react";

interface GridBackgroundProps {
  show: boolean;
  gridSize: number;
  panZoomState: { scale: number; translateX: number; translateY: number };
  width: number;
  height: number;
}

const GridBackground: React.FC<GridBackgroundProps> = ({ show, gridSize, panZoomState, width, height }) => {
  if (!show) return null;
  const scale = panZoomState.scale || 1;
  const offsetX = panZoomState.translateX || 0;
  const offsetY = panZoomState.translateY || 0;
  const size = gridSize * scale;
  const bgPosX = ((offsetX % size) + size) % size;
  const bgPosY = ((offsetY % size) + size) % size;
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width,
        height,
        pointerEvents: "none",
        zIndex: 0,
        backgroundImage:
          `repeating-linear-gradient(to right, #e0e0e0 0px, #e0e0e0 1px, transparent 1px, transparent ${size}px),` +
          `repeating-linear-gradient(to bottom, #e0e0e0 0px, #e0e0e0 1px, transparent 1px, transparent ${size}px)`,
        backgroundSize: `${size}px ${size}px`,
        backgroundPosition: `${bgPosX}px ${bgPosY}px`,
      }}
    />
  );
};

export default GridBackground;
