// src/components/GhostOverlay.tsx
'use client';
import React from "react";

interface GhostOverlayProps {
  activeType: string;
}

const GhostOverlay: React.FC<GhostOverlayProps> = ({ activeType }) => {
  switch (activeType) {
    case "button":
      return (
        <div className="px-3 py-1 bg-blue-500 text-white rounded shadow opacity-75">
          Button
        </div>
      );
    case "card":
      return (
        <div className="p-4 bg-white border rounded shadow opacity-75">
          Card Preview
        </div>
      );
    case "text":
      return (
        <div className="p-2 text-gray-800 opacity-75">
          Text Preview
        </div>
      );
    case "input":
      return (
        <input
          placeholder="Input"
          className="border border-black rounded p-1 opacity-75"
          readOnly
        />
      );
    default:
      return <div className="opacity-75">Unknown</div>;
  }
};

export default GhostOverlay;
