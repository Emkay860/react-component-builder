// src/components/Canvas.tsx
"use client";
import { useDroppable } from "@dnd-kit/core";
import { MouseEvent, useRef, useState } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { useZoom } from "../context/ZoomContext";
import { DroppedItem } from "../types";
import CanvasItem from "./CanvasItem";
import ContextMenu from "./menus/ContextMenu";
import { getDefaultMenuItems } from "./menus/menuItems";
import GridBackground from "./GridBackground";
import Rulers from "./Rulers";
import CanvasControls from "./CanvasControls";

type Props = {
  items: DroppedItem[];
  onSelect: (id: string, event?: MouseEvent) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  isDragging: boolean;
  selectedIds: string[];
  onGroup: () => void;
  onUngroup: () => void;
};

export default function Canvas({
  items,
  onSelect,
  onDelete,
  onDuplicate,
  isDragging,
  selectedIds,
  onGroup,
  onUngroup,
}: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: "canvas" });
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    id: string;
  } | null>(null);

  const { currentScale, setCurrentScale } = useZoom();

  const panZoomRef = useRef<{
    zoomIn: () => void;
    zoomOut: () => void;
    reset: () => void;
    center: () => void;
  } | null>(null);
  const setPanZoomRef = (refObj: any) => {
    if (refObj) {
      panZoomRef.current = {
        zoomIn: refObj.zoomIn,
        zoomOut: refObj.zoomOut,
        reset: refObj.resetTransform,
        center: refObj.centerView,
      };
    }
  };

  const [showGrid, setShowGrid] = useState(true);
  const [showRulers, setShowRulers] = useState(true);
  const gridSize = 40; // px
  const canvasWidth = 3000;
  const canvasHeight = 3000;

  const handleCanvasClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return; // Only left-click
    if (e.currentTarget === e.target) {
      onSelect("", e);
    }
    if (contextMenu) setContextMenu(null);
  };

  const handleItemContextMenu = (e: MouseEvent, id: string) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, id });
    // Do NOT call onSelect here; right-click should not change selection
  };

  const handleInnerMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      e.stopPropagation();
    }
  };

  const handleZoomIn = () => {
    panZoomRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    panZoomRef.current?.zoomOut();
  };

  const handleReset = () => {
    panZoomRef.current?.reset();
  };

  const handleCenterCanvas = () => {
    handleReset();
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
        maxScale={3}
        initialScale={1}
        wheel={{ step: 0.1, wheelDisabled: false, touchPadDisabled: false }}
        doubleClick={{ disabled: true }}
        panning={{ velocityDisabled: false }} // Enable velocity for smooth panning
        centerOnInit
        centerZoomedOut // Center canvas when zooming out
        limitToBounds={false} // Allow free panning/zooming
        onZoomStop={(ref) => setCurrentScale(ref.state.scale)}
        onInit={setPanZoomRef}
      >
        {(utils) => {
          const state = utils.instance.transformState;
          return (
            <TransformComponent wrapperStyle={{ width: '100%', height: '100%' }} contentStyle={{ width: canvasWidth, height: canvasHeight }}>
              <div
                onMouseDown={handleInnerMouseDown}
                style={{
                  position: "relative",
                  width: canvasWidth,
                  height: canvasHeight,
                  overflow: "hidden",
                  background: "#fff",
                }}
              >
                {/* Grid overlay */}
                <GridBackground
                  show={showGrid}
                  gridSize={gridSize}
                  panZoomState={{ scale: state.scale, translateX: state.positionX, translateY: state.positionY }}
                  width={canvasWidth}
                  height={canvasHeight}
                />
                {/* Canvas items */}
                {items.map((item) => (
                  <CanvasItem
                    key={item.id}
                    item={item}
                    onSelect={onSelect}
                    isSelected={selectedIds.includes(item.id)}
                    groupId={item.groupId}
                    onContextMenu={handleItemContextMenu}
                    currentScale={currentScale}
                  />
                ))}
              </div>
            </TransformComponent>
          );
        }}
      </TransformWrapper>
      <CanvasControls
        showGrid={showGrid}
        setShowGrid={setShowGrid}
        showRulers={showRulers}
        setShowRulers={setShowRulers}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onReset={handleReset}
        onCenter={handleCenterCanvas}
      />
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
