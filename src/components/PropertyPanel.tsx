// PropertyPanel.tsx
"use client";
import { DroppedItem } from "../types";

type PropertyPanelProps = {
  selectedItem?: DroppedItem;
  updateItem: (id: string, newProps: Partial<DroppedItem>) => void;
};

export default function PropertyPanel({
  selectedItem,
  updateItem,
}: PropertyPanelProps) {
  if (!selectedItem) {
    return (
      <div className="w-64 p-4 border-l">
        <h2 className="text-lg font-bold mb-4">Properties</h2>
        <p>No element selected.</p>
      </div>
    );
  }

  return (
    <div className="w-64 p-4 border-l">
      <h2 className="text-lg font-bold mb-4">Properties</h2>

      {(selectedItem.componentType === "button" ||
        selectedItem.componentType === "text") && (
        <div className="mb-4">
          <label className="block text-sm font-medium">Text</label>
          <input
            type="text"
            value={selectedItem.label || ""}
            onChange={(e) =>
              updateItem(selectedItem.id, { label: e.target.value })
            }
            className="mt-1 block w-full border border-gray-300 rounded p-2"
          />
        </div>
      )}

      <div className="mb-4">
        <label className="block text-sm font-medium">X Position</label>
        <input
          type="number"
          value={selectedItem.x}
          onChange={(e) =>
            updateItem(selectedItem.id, { x: Number(e.target.value) })
          }
          className="mt-1 block w-full border border-gray-300 rounded p-2"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium">Y Position</label>
        <input
          type="number"
          value={selectedItem.y}
          onChange={(e) =>
            updateItem(selectedItem.id, { y: Number(e.target.value) })
          }
          className="mt-1 block w-full border border-gray-300 rounded p-2"
        />
      </div>
    </div>
  );
}
