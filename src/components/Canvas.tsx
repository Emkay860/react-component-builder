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
  const canvasWidth = 3000;
  const canvasHeight = 3000;

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
      style={{ touchAction: "none", overflow: "hidden" }}
    >
      <Rulers show={showRulers} gridSize={gridSize} width={canvasWidth} height={canvasHeight} />
      <TransformWrapper
        minScale={0.2}
        maxScale={4}
        initialScale={1}
        wheel={{ step: 0.1 }}
        centerOnInit
        centerZoomedOut
        panning={{ disabled: false, allowLeftClickPan: false }}
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
        {({ zoomIn, zoomOut, resetTransform, centerView, ...rest }) => {
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
                onZoomIn={zoomIn}
                onZoomOut={zoomOut}
                onReset={resetTransform}
                onCenter={centerView}
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
