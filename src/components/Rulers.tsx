// src/components/Rulers.tsx
import React from "react";

interface RulersProps {
  show: boolean;
  gridSize: number;
  width: number;
  height: number;
}

const Rulers: React.FC<RulersProps> = ({ show, gridSize, width, height }) => {
  if (!show) return null;
  return (
    <>
      {/* Top ruler */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 40,
          width,
          height: 24,
          background: "#fafafa",
          borderBottom: "1px solid #e0e0e0",
          zIndex: 10,
          display: "flex",
        }}
      >
        {Array.from({ length: Math.floor(width / gridSize) + 1 }).map((_, i) => (
          <div
            key={`rtick-${i}`}
            style={{
              width: gridSize,
              height: "100%",
              borderLeft: i === 0 ? "none" : "1px solid #e0e0e0",
              position: "relative",
              fontSize: 10,
              color: "#888",
              textAlign: "center",
            }}
          >
            {i % 2 === 0 && <span style={{ position: "absolute", left: 0, top: 10 }}>{i * gridSize}</span>}
          </div>
        ))}
      </div>
      {/* Left ruler */}
      <div
        style={{
          position: "absolute",
          top: 24,
          left: 0,
          width: 40,
          height,
          background: "#fafafa",
          borderRight: "1px solid #e0e0e0",
          zIndex: 10,
        }}
      >
        {Array.from({ length: Math.floor(height / gridSize) + 1 }).map((_, i) => (
          <div
            key={`ltick-${i}`}
            style={{
              height: gridSize,
              width: "100%",
              borderTop: i === 0 ? "none" : "1px solid #e0e0e0",
              position: "relative",
              fontSize: 10,
              color: "#888",
              textAlign: "right",
            }}
          >
            {i % 2 === 0 && <span style={{ position: "absolute", right: 2, top: 0 }}>{i * gridSize}</span>}
          </div>
        ))}
      </div>
    </>
  );
};

export default Rulers;
