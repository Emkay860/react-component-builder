// src/components/Sidebar.tsx
"use client";
import React from "react";
import SidebarItem from "./SidebarItem";

// List of components available in the sidebar.
const componentsList = [
  { id: "button", componentType: "button", name: "Button" },
  { id: "card", componentType: "card", name: "Card" },
  { id: "text", componentType: "text", name: "Text" },
  { id: "input", componentType: "input", name: "Input" },
];
const Sidebar: React.FC = () => {
  return (
    <div className="w-64 bg-gray-100 border-r border-gray-300 p-4 flex flex-col">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Components</h2>
      <div className="flex-1 space-y-3">
        {componentsList.map((comp) => (
          <SidebarItem
            key={comp.id}
            id={comp.id}
            componentType={comp.componentType}
            name={comp.name}
          />
        ))}
      </div>
      <div className="mt-6 text-center text-black text-sm">
        Drag these components onto the canvas
      </div>
    </div>
  );
};

export default Sidebar;

// 'use client'
// import SidebarItem from "./SidebarItem";

// const componentsList = [
//   { id: "button", componentType: "button", name: "Button" },
//   { id: "card", componentType: "card", name: "Card" },
//   { id: "text", componentType: "text", name: "Text" },
//   { id: "input", componentType: "input", name: "Input" },
// ];

// export default function Sidebar() {
//   return (
//     <div className="w-48 bg-gray-100 border-r p-4 flex-shrink-0">
//       <h2 className="text-xl font-semibold mb-4 text-gray-900">Components</h2>
//       {componentsList.map((comp) => (
//         <SidebarItem
//           key={comp.id}
//           id={comp.id}
//           componentType={comp.componentType}
//           name={comp.name}
//         />
//       ))}
//     </div>
//   );
// }
