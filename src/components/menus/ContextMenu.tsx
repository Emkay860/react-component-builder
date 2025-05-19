//src/components/menus/ContextMenu.tsx
import React, { useEffect, useRef } from "react";

export interface MenuItem {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export interface ContextMenuProps {
  x: number;
  y: number;
  items: MenuItem[];
  onClose: () => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, items, onClose }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      ref={menuRef}
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
      onBlur={onClose}
      tabIndex={0}
    >
      {items.map((item, index) => (
        <div
          key={index}
          onClick={item.disabled ? undefined : (e) => {
            e.stopPropagation();
            item.onClick();
            onClose();
          }}
          className={`px-4 py-2 ${item.disabled ? "text-gray-400 cursor-not-allowed bg-gray-50" : "hover:bg-gray-100 cursor-pointer"}`}
          style={item.disabled ? { pointerEvents: "none", opacity: 0.6 } : {}}
        >
          {item.label}
        </div>
      ))}
    </div>
  );
};

export default ContextMenu;
