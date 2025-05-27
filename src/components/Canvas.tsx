// src/components/Canvas.tsx
"use client";
import React, { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { DroppedItem } from "../types";
import CanvasItem from "./CanvasItem";
import ContextMenu from "./menus/ContextMenu";
import { getDefaultMenuItems } from "./menus/menuItems";
import GridBackground from "./GridBackground";
import Rulers from "./Rulers";
import CanvasControls from "./CanvasControls";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

type Props = {
  items: DroppedItem[];
  onSelect: (id: string, event?: React.MouseEvent) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  isDragging: boolean;
  selectedIds: string[];
  onGroup: () => void;
  onUngroup: () => void;
  onPanZoomChange?: (state: { scale: number; positionX: number; positionY: number }) => void;
};

export default function Canvas({
  items,
  onSelect,
  onDelete,
  onDuplicate,
  selectedIds,
  onGroup,
  onUngroup,
  onPanZoomChange,
}: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: "canvas" });
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    id: string;
  } | null>(null);
  const [showGrid, setShowGrid] = useState(true);
  const [showRulers, setShowRulers] = useState(true);
  const gridSize = 40; // px
  const canvasWidth = 30000;
  const canvasHeight = 30000;

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    if (e.currentTarget === e.target) {
      onSelect("", e);
    }
    if (contextMenu) setContextMenu(null);
  };

  const handleItemContextMenu = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, id });
  };

  return (
    <div
      ref={setNodeRef}
      id="canvas-root"
      className={`relative flex-1 m-4 border-2 rounded-lg overflow-auto ${
        isOver ? "border-blue-400 bg-blue-50" : "border-gray-300 bg-gray-50"
      }`}
      onClick={handleCanvasClick}
      style={{ touchAction: "none", overflow: "hidden", background: "transparent", }}
    >
      <Rulers show={showRulers} gridSize={gridSize} width={canvasWidth} height={canvasHeight} />
      <TransformWrapper
        minScale={0.2}
        maxScale={4}
        initialScale={1}
        wheel={{ step: 0.1 }}
        panning={{ disabled: false, allowLeftClickPan: false }}
        limitToBounds={false}
        alignmentAnimation={{ sizeX: canvasWidth, sizeY: canvasHeight }}
        onTransformed={(_, state) => {
          if (onPanZoomChange) {
            onPanZoomChange({
              scale: state.scale,
              positionX: state.positionX,
              positionY: state.positionY,
            });
          }
        }}
      >
        {({ zoomIn, zoomOut, resetTransform, centerView, setTransform, ...rest }) => {
          // Get the visible container size
          const container = document.getElementById("canvas-root");
          const containerRect = container ? container.getBoundingClientRect() : { width: 1200, height: 800 };
          // Center of the visible area (container)
          const viewportCenterX = containerRect.width / 2;
          const viewportCenterY = containerRect.height / 2;
          // Center of the canvas
          const canvasCenterX = canvasWidth / 2;
          const canvasCenterY = canvasHeight / 2;

          // Helper to get the center of the selected element (or canvas center if none)
          let targetCenterX = canvasCenterX;
          let targetCenterY = canvasCenterY;
          if (selectedIds.length > 0) {
            const selected = items.find(i => i.id === selectedIds[0]);
            if (selected) {
              const width = selected.width || 100;
              const height = selected.height || 100;
              targetCenterX = (selected.x || 0) + width / 2;
              targetCenterY = (selected.y || 0) + height / 2;
            }
          }

          // Center the viewport on the selected element (or canvas center)
          const focusOnTarget = (scaleOverride?: number, animTime = 300) => {
            const scale = scaleOverride ?? rest.instance.transformState.scale;
            const positionX = viewportCenterX - targetCenterX * scale;
            const positionY = viewportCenterY - targetCenterY * scale;
            setTransform(positionX, positionY, scale, animTime, "easeInOutQuad");
          };

          const handleCenter = () => focusOnTarget();

          // Zoom in/out, then focus on the selected element
          const handleZoomIn = () => {
            const newScale = Math.min(rest.instance.transformState.scale + 0.2, 4);
            focusOnTarget(newScale, 200);
          };
          const handleZoomOut = () => {
            const newScale = Math.max(rest.instance.transformState.scale - 0.2, 0.2);
            focusOnTarget(newScale, 200);
          };
          // Reset: zoom to 1 and focus on selected element (or canvas center)
          const handleReset = () => focusOnTarget(1, 300);

          const { scale, positionX, positionY } = rest.instance.transformState;
          return (
            <>
              <TransformComponent>
                <div
                  style={{
                    position: "relative",
                    width: canvasWidth,
                    height: canvasHeight,
                    overflow: "hidden",
                    background: "#fff",
                  }}
                >
                  <GridBackground
                    show={showGrid}
                    gridSize={gridSize}
                    panZoomState={{ scale, translateX: positionX, translateY: positionY }}
                    width={canvasWidth}
                    height={canvasHeight}
                  />
                  {items.map((item) => (
                    <CanvasItem
                      key={item.id}
                      item={item}
                      onSelect={onSelect}
                      isSelected={selectedIds.includes(item.id)}
                      groupId={item.groupId}
                      onContextMenu={handleItemContextMenu}
                      currentScale={scale}
                    />
                  ))}
                </div>
              </TransformComponent>
              <CanvasControls
                showGrid={showGrid}
                setShowGrid={setShowGrid}
                showRulers={showRulers}
                setShowRulers={setShowRulers}
                onZoomIn={handleZoomIn}
                onZoomOut={handleZoomOut}
                onReset={handleReset}
                onCenter={handleCenter}
              />
            </>
          );
        }}
      </TransformWrapper>
      {items.length === 0 && (
        <p className="absolute inset-0 flex items-center justify-center text-gray-500">
          Drop here
        </p>
      )}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          items={getDefaultMenuItems(
            contextMenu.id,
            onDelete,
            onDuplicate,
            selectedIds,
            items,
            onGroup,
            onUngroup
          )}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
}
