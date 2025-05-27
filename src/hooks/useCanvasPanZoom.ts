import { useCallback } from "react";
import type { DroppedItem } from "../types";

export interface UseCanvasPanZoomProps {
  items: DroppedItem[];
  selectedIds: string[];
  canvasWidth: number;
  canvasHeight: number;
  getViewportRect: () => { width: number; height: number };
  setTransform: (
    x: number,
    y: number,
    scale: number,
    animTime?: number,
    animType?:
      | "easeOut"
      | "linear"
      | "easeInQuad"
      | "easeOutQuad"
      | "easeInOutQuad"
      | "easeInCubic"
      | "easeOutCubic"
      | "easeInOutCubic"
      | "easeInQuart"
      | "easeOutQuart"
      | "easeInOutQuart"
      | "easeInQuint"
      | "easeOutQuint"
      | "easeInOutQuint"
      | undefined
  ) => void;
  getScale: () => number;
}

export function useCanvasPanZoom({
  items,
  selectedIds,
  canvasWidth,
  canvasHeight,
  getViewportRect,
  setTransform,
  getScale,
}: UseCanvasPanZoomProps) {
  // Helper to get the center of the selected element (or canvas center if none)
  const getTargetCenter = useCallback(() => {
    let targetCenterX = canvasWidth / 2;
    let targetCenterY = canvasHeight / 2;
    if (selectedIds.length > 0) {
      const selected = items.find((i) => i.id === selectedIds[0]);
      if (selected) {
        const width = selected.width || 100;
        const height = selected.height || 100;
        targetCenterX = (selected.x || 0) + width / 2;
        targetCenterY = (selected.y || 0) + height / 2;
      }
    }
    return { targetCenterX, targetCenterY };
  }, [items, selectedIds, canvasWidth, canvasHeight]);

  // Center the viewport on the selected element (or canvas center)
  const focusOnTarget = useCallback(
    (scaleOverride?: number, animTime = 300) => {
      const { width: viewportW, height: viewportH } = getViewportRect();
      const { targetCenterX, targetCenterY } = getTargetCenter();
      const scale = scaleOverride ?? getScale();
      const positionX = viewportW / 2 - targetCenterX * scale;
      const positionY = viewportH / 2 - targetCenterY * scale;
      setTransform(positionX, positionY, scale, animTime, "easeInOutQuad");
    },
    [getViewportRect, getTargetCenter, getScale, setTransform]
  );

  const handleCenter = useCallback(() => focusOnTarget(), [focusOnTarget]);
  const handleZoomIn = useCallback(() => {
    const newScale = Math.min(getScale() + 0.2, 4);
    focusOnTarget(newScale, 200);
  }, [focusOnTarget, getScale]);
  const handleZoomOut = useCallback(() => {
    const newScale = Math.max(getScale() - 0.2, 0.2);
    focusOnTarget(newScale, 200);
  }, [focusOnTarget, getScale]);
  const handleReset = useCallback(() => focusOnTarget(1, 300), [focusOnTarget]);

  return {
    handleCenter,
    handleZoomIn,
    handleZoomOut,
    handleReset,
    getTargetCenter,
    focusOnTarget,
  };
}
