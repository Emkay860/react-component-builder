// src/components/CanvasControls.tsx
import React from "react";

interface CanvasControlsProps {
  showGrid: boolean;
  setShowGrid: (v: boolean) => void;
  showRulers: boolean;
  setShowRulers: (v: boolean) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  onCenter: () => void;
}

const CanvasControls: React.FC<CanvasControlsProps> = ({
  showGrid,
  setShowGrid,
  showRulers,
  setShowRulers,
  onZoomIn,
  onZoomOut,
  onReset,
  onCenter,
}) => (
  <div
    style={{
      position: "absolute",
      top: 10,
      right: 10,
      zIndex: 1000,
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    }}
  >
    <label className="text-black cursor-pointer" style={{ background: "#fff", padding: 4, borderRadius: 4, fontSize: 12 }}>
      <input
        type="checkbox"
        checked={showGrid}
        onChange={() => setShowGrid(!showGrid)}
        style={{ marginRight: 4 }}
      />
      Show Grid
    </label>
    <label className="text-black cursor-pointer" style={{ background: "#fff", padding: 4, borderRadius: 4, fontSize: 12 }}>
      <input
        type="checkbox"
        checked={showRulers}
        onChange={() => setShowRulers(!showRulers)}
        style={{ marginRight: 4 }}
      />
      Show Rulers
    </label>
    <button
      onClick={onZoomIn}
      style={{
        padding: "6px 10px",
        backgroundColor: "#007bff",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
      }}
    >
      +
    </button>
    <button
      onClick={onZoomOut}
      style={{
        padding: "6px 10px",
        backgroundColor: "#007bff",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
      }}
    >
      –
    </button>
    <button
      onClick={onReset}
      style={{
        padding: "6px 10px",
        backgroundColor: "#007bff",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
      }}
    >
      Reset
    </button>
    <button
      onClick={onCenter}
      style={{
        padding: "6px 10px",
        backgroundColor: "#007bff",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
      }}
    >
      Center
    </button>
  </div>
);

export default CanvasControls;
