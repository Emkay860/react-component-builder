// src/components/Canvas.tsx
"use client";
import { useDroppable } from "@dnd-kit/core";
import { MouseEvent, useRef, useState } from "react";
import PanZoom, { PanZoomHandle } from "react-easy-panzoom";
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

  const panZoomRef = useRef<PanZoomHandle | null>(null);

  const [showGrid, setShowGrid] = useState(true);
  const [showRulers, setShowRulers] = useState(true);
  const gridSize = 40; // px
  const canvasWidth = 3000;
  const canvasHeight = 3000;

  const [panZoomState, setPanZoomState] = useState({ scale: 1, translateX: 0, translateY: 0 });

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
    if (panZoomRef.current && panZoomRef.current.zoomIn) {
      panZoomRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (panZoomRef.current && panZoomRef.current.zoomOut) {
      panZoomRef.current.zoomOut();
    }
  };

  const handleReset = () => {
    if (panZoomRef.current && panZoomRef.current.reset) {
      panZoomRef.current.reset();
    }
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
      <PanZoom
        ref={panZoomRef}
        onStateChange={(state) => {
          setCurrentScale(state.scale);
          setPanZoomState(state);
        }}
        minZoom={0.2}
        maxZoom={3}
      >
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
            panZoomState={panZoomState}
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
      </PanZoom>
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
