// src/components/NavigatorPanel.tsx
"use client";
import React from "react";
import type { DroppedItem } from "../types";

interface NavigatorPanelProps {
  items: DroppedItem[];
  onSelect: (id: string) => void;
  selectedId: string | null;
}

// Helper to build a tree structure from flat items
function buildTree(items: DroppedItem[]) {
  const map: Record<string, DroppedItem & { children: DroppedItem[] }> = {};
  const roots: (DroppedItem & { children: DroppedItem[] })[] = [];
  items.forEach((item) => {
    map[item.id] = { ...item, children: [] };
  });
  items.forEach((item) => {
    if (item.parentId && map[item.parentId]) {
      map[item.parentId].children.push(map[item.id]);
    } else {
      roots.push(map[item.id]);
    }
  });
  return roots;
}

const TreeNode: React.FC<{
  node: DroppedItem & { children: DroppedItem[] };
  onSelect: (id: string) => void;
  selectedId: string | null;
  level?: number;
}> = ({ node, onSelect, selectedId, level = 0 }) => {
  const isParent = node.children.length > 0;
  return (
    <div className="text-black" style={{ marginLeft: level * 16, position: 'relative' }}>
      <div
        className={`flex items-center px-2 py-1 rounded cursor-pointer gap-2 ${
          selectedId === node.id ? "bg-blue-200 text-blue-900" : "hover:bg-gray-200"
        }`}
        onClick={() => onSelect(node.id)}
      >
        {/* Caret for parent nodes */}
        {isParent && (
          <span className="text-xs text-gray-500">▼</span>
        )}
        <span>{node.label || node.componentType}</span>
        {/* Badge for parent/child */}
        {isParent && (
          <span className="ml-1 px-1 text-xs bg-blue-100 text-blue-700 rounded">Parent</span>
        )}
        {level > 0 && !isParent && (
          <span className="ml-1 px-1 text-xs bg-gray-100 text-gray-700 rounded">Child</span>
        )}
      </div>
      {node.children.map((child) => (
        <TreeNode
          key={child.id}
          node={child as any}
          onSelect={onSelect}
          selectedId={selectedId}
          level={level + 1}
        />
      ))}
    </div>
  );
};

const NavigatorPanel: React.FC<NavigatorPanelProps> = ({ items, onSelect, selectedId }) => {
  const tree = buildTree(items);
  return (
    <div className="w-64 p-4 border-l overflow-y-auto">
      <h2 className="text-lg font-bold mb-4">Navigator</h2>
      {tree.length === 0 ? (
        <p className="text-gray-500">No elements on canvas.</p>
      ) : (
        tree.map((node) => (
          <TreeNode
            key={node.id}
            node={node}
            onSelect={onSelect}
            selectedId={selectedId}
          />
        ))
      )}
    </div>
  );
};

export default NavigatorPanel;
