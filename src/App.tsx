// src/App.tsx
"use client";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import React, { useState } from "react";
import Canvas from "./components/Canvas";
import CodePreview from "./components/CodePreview";
import GhostOverlay from "./components/GhostOverlay";
import PropertyPanel from "./components/PropertyPanel";
import Sidebar from "./components/Sidebar";
import GeneratedTestPage from "./pages/GeneratedTestPage";
import NavigatorPanel from "./components/NavigatorPanel";
import { DroppedItem } from "./types";
import { Tabs, TabList, Tab, TabPanel } from "./components/Tabs";
import { v4 as uuidv4 } from "uuid";

// Import the consolidated plugins so their registration code runs.
import { useZoom } from "./context/ZoomContext";
import "./plugins";

export default function App() {
  const [items, setItems] = useState<DroppedItem[]>([]);
  const [startCoordinates, setStartCoordinates] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState("editor");
  const [isDragging, setIsDragging] = useState(false);
  // State to store the current zoom scale (brought up from Canvas)
  const { currentScale, setCurrentScale } = useZoom();

  const handleDragStart = (event: DragStartEvent) => {
    const mouseEvent = event.activatorEvent as MouseEvent;
    setActiveId(String(event.active.id));

    const existingItem = items.find(
      (item) => item.id === String(event.active.id)
    );
    const draggedType = event.active.data.current?.componentType;
    if (existingItem) {
      setStartCoordinates({ x: existingItem.x, y: existingItem.y });
    } else {
      setStartCoordinates({
        x: mouseEvent.clientX,
        y: mouseEvent.clientY,
      });
      if (draggedType) {
        setActiveType(draggedType);
      }
    }

    setIsDragging(true);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over, delta } = event;
    setActiveId(null);
    setActiveType(null);
    if (!startCoordinates) return;

    // Obtain the canvas element rect.
    const canvas = document.getElementById("canvas-root");
    if (!canvas) return;
    const canvasRect = canvas.getBoundingClientRect();
    const isExistingItem = items.some((item) => item.id === String(active.id));

    const parentId =
      over && over.id !== "canvas" && over.id !== String(active.id)
        ? String(over.id)
        : undefined;

    if (isExistingItem) {
      // Adjust the delta by dividing to currentScale.
      const finalX = startCoordinates.x + delta.x / currentScale;
      const finalY = startCoordinates.y + delta.y / currentScale;
      // Find the dragged item
      const draggedItem = items.find((item) => item.id === String(active.id));
      if (draggedItem && draggedItem.groupId) {
        // Move all group members by the same delta
        setItems((prev) =>
          prev.map((item) => {
            if (item.groupId === draggedItem.groupId) {
              // Move by the same delta as the dragged item
              const dx = finalX - draggedItem.x;
              const dy = finalY - draggedItem.y;
              // Only update parentId for the dragged item
              const newParentId =
                item.id === draggedItem.id && parentId !== undefined
                  ? parentId
                  : item.parentId;
              return {
                ...item,
                x: item.x + dx,
                y: item.y + dy,
                parentId: newParentId,
              };
            }
            return item;
          })
        );
      } else {
        setItems((prev) =>
          prev.map((item) => {
            if (item.id === String(active.id)) {
              // Only update parentId if it actually changed (prevents accidental unparenting on click)
              const newParentId = parentId !== undefined ? parentId : item.parentId;
              return { ...item, x: finalX, y: finalY, parentId: newParentId };
            }
            return item;
          })
        );
      }
    } else if (active.data.current?.componentType) {
      const finalX =
        startCoordinates.x + delta.x / currentScale - canvasRect.left;
      const finalY =
        startCoordinates.y + delta.y / currentScale - canvasRect.top;
      const newItem: DroppedItem = {
        id: `canvas-${active.data.current.componentType}-${Date.now()}`,
        x: finalX,
        y: finalY,
        zIndex: 1,
        componentType: active.data.current.componentType,
        label:
          active.data.current.componentType === "button" ||
          active.data.current.componentType === "text"
            ? active.data.current.componentType === "button"
              ? "Button"
              : "Text Element"
            : undefined,
        parentId: parentId,
        // Ensure isContainer is always explicitly set to false for new items unless otherwise specified
        isContainer: false,
      };
      setItems((prev) => [...prev, newItem]);
    }
    setStartCoordinates(null);
    setIsDragging(false);
  };

  // Update element properties (from Property Panel)
  const updateItem = (id: string, newProps: Partial<DroppedItem>) => {
    console.log("[updateItem] id:", id, "newProps:", newProps);
    setItems((prev) => {
      const updated = prev.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, ...newProps };
          console.log("[updateItem] Updated item:", updatedItem);
          return updatedItem;
        }
        return item;
      });
      console.log("[updateItem] All items after update:", updated);
      return updated;
    });
  };

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    if (selectedIds.includes(id)) {
      setSelectedIds((prev) => prev.filter((sid) => sid !== id));
    }
  };

  const handleDuplicate = (id: string) => {
    const item = items.find((it) => it.id === id);
    if (!item) return;
    const newItem: DroppedItem = {
      ...item, // preserve all properties including isContainer
      id: `${item.id}-dup-${Date.now()}`,
      x: item.x + 10,
      y: item.y + 10,
    };
    setItems((prev) => [...prev, newItem]);
  };

  // In your ZoomContext this may be used to initialize state,
  // or you can update it through your existing ZoomContext provider.
  // For example, on navigating back to the editor:
  const handleEditorClick = () => {
    setCurrentScale(1); // Reset currentScale before changing view.
    setCurrentPage("editor");
  };

  // Group/Ungroup logic
  const handleGroup = () => {
    if (selectedIds.length < 2) return;
    const groupId = uuidv4();
    setItems((prev) =>
      prev.map((item) =>
        selectedIds.includes(item.id) ? { ...item, groupId } : item
      )
    );
  };
  const handleUngroup = () => {
    setItems((prev) =>
      prev.map((item) =>
        selectedIds.includes(item.id) ? { ...item, groupId: undefined } : item
      )
    );
  };

  // Handler to set groupAlias for all items in a group
  const handleRenameGroupAlias = (groupId: string, alias: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.groupId === groupId ? { ...item, groupAlias: alias || undefined } : item
      )
    );
  };

  // Multi-select aware select handler (group-aware)
  const handleSelect = (id: string, event?: MouseEvent | React.MouseEvent) => {
    const item = items.find((it) => it.id === id);
    if (item?.groupId) {
      // If part of a group, select all group members
      const groupMembers = items
        .filter((it) => it.groupId === item.groupId)
        .map((it) => it.id);
      setSelectedIds(groupMembers);
      return;
    }
    if (event && (event.ctrlKey || event.metaKey)) {
      setSelectedIds((prev) =>
        prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
      );
    } else {
      setSelectedIds(id ? [id] : []);
    }
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex p-4 bg-gray-100 space-x-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={handleEditorClick}
        >
          Editor
        </button>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded"
          onClick={() => setCurrentPage("preview")}
        >
          Preview
        </button>
        {/* Group/Ungroup controls */}
        <button
          className="px-4 py-2 bg-purple-500 text-white rounded"
          onClick={handleGroup}
          disabled={selectedIds.length < 2}
        >
          Group
        </button>
        <button
          className="px-4 py-2 bg-yellow-500 text-black rounded"
          onClick={handleUngroup}
          disabled={
            selectedIds.length === 0 ||
            !selectedIds.some((id) =>
              items.find((it) => it.id === id && it.groupId)
            )
          }
        >
          Ungroup
        </button>
      </div>

      {currentPage === "editor" && (
        <div className="flex h-[90vh] w-screen">
          <Sidebar />
          <Canvas
            items={items}
            onSelect={handleSelect}
            onDelete={handleDelete}
            onDuplicate={handleDuplicate}
            isDragging={isDragging}
            selectedIds={selectedIds}
            onGroup={handleGroup}
            onUngroup={handleUngroup}
          />
          {/* Right Panel with Tabs using reusable Tabs component */}
          <div className="w-64 flex flex-col border-l bg-white">
            <Tabs defaultTab="properties">
              <TabList>
                <Tab tab="properties">Properties</Tab>
                <Tab tab="navigator">Navigator</Tab>
              </TabList>
              <TabPanel tab="properties">
                <PropertyPanel
                  selectedItem={items.find((item) => item.id === selectedIds[0])}
                  updateItem={updateItem}
                  onRenameGroupAlias={handleRenameGroupAlias}
                />
              </TabPanel>
              <TabPanel tab="navigator">
                <NavigatorPanel
                  items={items}
                  onSelect={handleSelect}
                  selectedIds={selectedIds}
                />
              </TabPanel>
            </Tabs>
          </div>
          <CodePreview items={items} />
        </div>
      )}

      {currentPage === "preview" && <GeneratedTestPage items={items} />}

      <DragOverlay>
        {activeId && activeType && (() => {
          const draggedItem = items.find((item) => item.id === activeId);
          if (draggedItem && draggedItem.groupId) {
            // Get all group members
            const groupMembers = items.filter(
              (item) => item.groupId === draggedItem.groupId
            );
            // Calculate relative positions
            const baseX = draggedItem.x;
            const baseY = draggedItem.y;
            return (
              <div style={{ position: "relative" }}>
                {groupMembers.map((member) => (
                  <div
                    key={member.id}
                    style={{
                      position: "absolute",
                      left: member.x - baseX,
                      top: member.y - baseY,
                      pointerEvents: "none",
                      opacity: 0.7,
                    }}
                  >
                    <GhostOverlay activeType={member.componentType} />
                  </div>
                ))}
              </div>
            );
          } else if (activeType) {
            return <GhostOverlay activeType={activeType} />;
          }
          return null;
        })()}
      </DragOverlay>
    </DndContext>
  );
}
