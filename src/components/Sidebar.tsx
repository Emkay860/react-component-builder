// src/components/Sidebar.tsx
"use client";
import React from "react";
import { pluginRegistry } from "../plugins/PluginRegistry";
import SidebarItem from "./SidebarItem";

const Sidebar: React.FC = () => {
  const plugins = pluginRegistry.getAllPlugins();
  return (
    <div className="w-64 bg-gray-100 border-r border-gray-300 p-4 flex flex-col">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Components</h2>
      <div className="flex-1 space-y-3">
        {plugins.map((plugin) => (
          <SidebarItem
            key={plugin.type}
            id={plugin.type}
            componentType={plugin.type}
            name={plugin.name}
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
