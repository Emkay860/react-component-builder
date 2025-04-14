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
      className="text-black w-[200px] bg-white border rounded shadow z-50"
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
      // onContextMenu={(e) => e.preventDefault()}
      onBlur={onClose}
      tabIndex={0}
      // onClick={(e) => {
      //   // Prevent clicks inside the menu from propagating so the menu isn't closed prematurely.
      //   e.stopPropagation();
      // }}
    >
      {items.map((item, index) => (
        <div
          key={index}
          onClick={(e) => {
            e.stopPropagation();
            item.onClick();
            onClose();
          }}
          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
        >
          {item.label}
        </div>
      ))}
    </div>
  );
};

export default ContextMenu;

