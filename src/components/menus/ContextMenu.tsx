import React from "react";

export interface MenuItem {
  label: string;
  onClick: () => void;
}

export interface ContextMenuProps {
  x: number;
  y: number;
  items: MenuItem[];
  onClose: () => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, items, onClose }) => {
  return (
    <div
    className="text-black w-[200px]"
      style={{
        position: "fixed",
        top: y,
        left: x,
        backgroundColor: "#fff",
        border: "1px solid #ccc",
        padding: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
        zIndex: 1000,
      }}
      onContextMenu={(e) => e.preventDefault()}
      onClick={(e) => {
        // Prevent clicks inside the menu from propagating so the menu isn't closed prematurely.
        e.stopPropagation();
      }}
    >
      {items.map((item, index) => (
        <button
          key={index}
          onClick={(e) => {
            e.stopPropagation();
            item.onClick();
            onClose();
          }}
          style={{
            display: "block",
            width: "100%",
            textAlign: "left",
            border: "none",
            background: "none",
            padding: "4px 0",
            cursor: "pointer",
          }}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default ContextMenu;
