// src/components/NavigatorPanel.tsx
"use client";
import React from "react";
import type { DroppedItem } from "../types";

interface NavigatorPanelProps {
  items: DroppedItem[];
  onSelect: (id: string, event?: React.MouseEvent) => void;
  selectedIds: string[];
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
  // Sort children of each node by x, then y
  Object.values(map).forEach(node => {
    node.children.sort((a, b) => (a.x !== b.x ? a.x - b.x : a.y - b.y));
  });
  // Sort roots as well
  roots.sort((a, b) => (a.x !== b.x ? a.x - b.x : a.y - b.y));
  return roots;
}

const TreeNode: React.FC<{
  node: DroppedItem & { children: DroppedItem[] };
  onSelect: (id: string, event?: React.MouseEvent) => void;
  selectedIds: string[];
  level?: number;
  collapsedMap?: Record<string, boolean>;
  toggleCollapse?: (id: string) => void;
}> = ({ node, onSelect, selectedIds, level = 0, collapsedMap = {}, toggleCollapse = () => {} }) => {
  const isParent = node.children.length > 0;
  const isCollapsed = collapsedMap[node.id] || false;
  return (
    <div className="text-black" style={{ marginLeft: level * 16, position: 'relative' }}>
      <div
        className={`flex items-center px-2 py-1 rounded cursor-pointer gap-2 ${
          selectedIds.includes(node.id) ? "bg-blue-200 text-blue-900" : "hover:bg-gray-200"
        } ${node.groupId ? "ring-2 ring-purple-400" : ""}`}
        onClick={(e) => {
          if (e.button === 0) onSelect(node.id, e);
        }}
      >
        {/* Caret for parent nodes, clickable for collapse/expand */}
        {isParent && (
          <span
            className="text-xs text-gray-500 select-none cursor-pointer"
            onClick={e => { e.stopPropagation(); toggleCollapse(node.id); }}
          >
            {isCollapsed ? "▶" : "▼"}
          </span>
        )}
        <span>{node.label || node.componentType}</span>
        {(node.groupId || node.groupAlias) && (
          <span
            className="ml-2 px-1 text-xs bg-purple-100 text-purple-700 rounded border border-purple-300 max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap inline-block align-middle"
            title={node.groupId}
          >
            {node.groupAlias || node.groupId}
          </span>
        )}
        {/* Badge for parent/child */}
        {isParent && (
          <span className="ml-1 px-1 text-xs bg-blue-100 text-blue-700 rounded">Parent</span>
        )}
        {level > 0 && !isParent && (
          <span className="ml-1 px-1 text-xs bg-gray-100 text-gray-700 rounded">Child</span>
        )}
        {/* Group indicator */}
        {node.groupId && (
          <span className="ml-1 px-1 text-xs bg-purple-200 text-purple-700 rounded">Group</span>
        )}
      </div>
      {/* Render children only if not collapsed */}
      {isParent && !isCollapsed && node.children.map((child) => (
        <TreeNode
          key={child.id}
          node={child as any}
          onSelect={onSelect}
          selectedIds={selectedIds}
          level={level + 1}
          collapsedMap={collapsedMap}
          toggleCollapse={toggleCollapse}
        />
      ))}
    </div>
  );
};

const NavigatorPanel: React.FC<NavigatorPanelProps> = ({ items, onSelect, selectedIds }) => {
  const tree = buildTree(items);
  const [collapsedMap, setCollapsedMap] = React.useState<Record<string, boolean>>({});
  const toggleCollapse = (id: string) => {
    setCollapsedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };
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
            selectedIds={selectedIds}
            collapsedMap={collapsedMap}
            toggleCollapse={toggleCollapse}
          />
        ))
      )}
    </div>
  );
};

export default NavigatorPanel;
