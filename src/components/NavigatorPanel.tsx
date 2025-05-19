// src/components/NavigatorPanel.tsx
"use client";
import React from "react";
import type { DroppedItem } from "../types";

interface NavigatorPanelProps {
  items: DroppedItem[];
  onSelect: (id: string, event?: React.MouseEvent) => void;
  selectedIds: string[];
}

// Helper to build a tree structure with group nodes
function buildTreeWithGroups(items: DroppedItem[]) {
  // 1. Find all unique groupIds
  const groupMap: Record<string, { id: string; alias?: string; children: DroppedItem[] }> = {};
  const ungrouped: DroppedItem[] = [];
  items.forEach(item => {
    if (item.groupId) {
      if (!groupMap[item.groupId]) {
        groupMap[item.groupId] = {
          id: item.groupId,
          alias: item.groupAlias,
          children: [],
        };
      }
      groupMap[item.groupId].children.push(item);
      // Optionally, sort children by x/y here
    } else {
      ungrouped.push(item);
    }
  });
  // 2. Build group nodes as virtual nodes
  const groupNodes = Object.values(groupMap).map(group => ({
    id: `group-${group.id}`,
    label: group.alias || group.id,
    isGroup: true,
    groupId: group.id,
    groupAlias: group.alias,
    children: group.children,
  }));
  // 3. Return group nodes + ungrouped items as roots
  return [...groupNodes, ...ungrouped.map(item => ({ ...item, children: [] }))];
}

const TreeNode: React.FC<{
  node: any;
  onSelect: (id: string, event?: React.MouseEvent) => void;
  selectedIds: string[];
  level?: number;
  collapsedMap?: Record<string, boolean>;
  toggleCollapse?: (id: string) => void;
}> = ({ node, onSelect, selectedIds, level = 0, collapsedMap = {}, toggleCollapse = () => {} }) => {
  const isGroup = node.isGroup;
  const isParent = (node.children && node.children.length > 0);
  const isCollapsed = collapsedMap[node.id] || false;
  return (
    <div className="text-black" style={{ marginLeft: level * 16, position: 'relative' }}>
      <div
        className={`flex items-center px-2 py-1 rounded cursor-pointer gap-2 ${
          isGroup
            ? "bg-purple-50 text-purple-900 border border-purple-200" // group node style
            : selectedIds.includes(node.id)
            ? "bg-blue-200 text-blue-900"
            : "hover:bg-gray-200"
        }`}
        onClick={e => {
          if (e.button === 0) {
            if (isGroup) {
              // Select all group members
              if (node.children) {
                node.children.forEach((child: DroppedItem) => onSelect(child.id, e));
              }
            } else {
              onSelect(node.id, e);
            }
          }
        }}
      >
        {/* Caret for parent/group nodes, clickable for collapse/expand */}
        {isParent && (
          <span
            className="text-xs text-gray-500 select-none cursor-pointer"
            onClick={e => { e.stopPropagation(); toggleCollapse(node.id); }}
          >
            {isCollapsed ? "▶" : "▼"}
          </span>
        )}
        <span
          className={
            isGroup
              ? "font-bold max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap inline-block align-middle"
              : ""
          }
          title={isGroup ? (node.label || node.groupId) : undefined}
        >
          {isGroup ? (node.label || node.groupId) : (node.label || node.componentType)}
        </span>
        {/* {isGroup && (
          <span className="ml-2 px-1 text-xs bg-purple-100 text-purple-700 rounded border border-purple-300 max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap inline-block align-middle" title={node.groupId}>
            {node.groupAlias || node.groupId}
          </span>
        )} */}
        {/* Badge for parent/child/group */}
        {isGroup && (
          <span className="ml-1 px-1 text-xs bg-purple-200 text-purple-700 rounded">Group</span>
        )}
        {!isGroup && isParent && (
          <span className="ml-1 px-1 text-xs bg-blue-100 text-blue-700 rounded">Parent</span>
        )}
        {!isGroup && level > 0 && !isParent && (
          <span className="ml-1 px-1 text-xs bg-gray-100 text-gray-700 rounded">Child</span>
        )}
      </div>
      {/* Render children only if not collapsed */}
      {isParent && !isCollapsed && node.children.map((child: any) => (
        <TreeNode
          key={child.id}
          node={child}
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
  const tree = buildTreeWithGroups(items);
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
