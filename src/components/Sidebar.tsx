'use client'
import SidebarItem from "./SidebarItem";

const componentsList = [
  { id: "button", componentType: "button", name: "Button" },
  { id: "card", componentType: "card", name: "Card" },
  { id: "text", componentType: "text", name: "Text" },
  { id: "input", componentType: "input", name: "Input" },
];

export default function Sidebar() {
  return (
    <div className="w-48 bg-gray-100 border-r p-4 flex-shrink-0">
      <h2 className="text-xl font-semibold mb-4 text-gray-900">Components</h2>
      {componentsList.map((comp) => (
        <SidebarItem
          key={comp.id}
          id={comp.id}
          componentType={comp.componentType}
          name={comp.name}
        />
      ))}
    </div>
  );
}
