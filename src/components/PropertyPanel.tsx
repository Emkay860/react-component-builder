// src/PropertyPanel.tsx
"use client";
import {
  componentProperties,
  PropertyField,
} from "../config/componentProperties";
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

  // Get component-specific property definitions from our config.
  const specificDefinitions: PropertyField[] =
    componentProperties[selectedItem.componentType] || [];

  return (
    <div className="w-64 p-4 border-l overflow-y-auto">
      <h2 className="text-lg font-bold mb-4">Properties</h2>

      {/* General properties (X, Y, and Z-Index) */}
      <div className="mb-4">
        <h3 className="text-md font-semibold mb-2">General</h3>
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
        <div className="mb-4">
          <label className="block text-sm font-medium">Z-Index</label>
          <input
            type="number"
            value={selectedItem.zIndex !== undefined ? selectedItem.zIndex : 1}
            onChange={(e) =>
              updateItem(selectedItem.id, { zIndex: Number(e.target.value) })
            }
            className="mt-1 block w-full border border-gray-300 rounded p-2"
          />
        </div>
      </div>

      {/* Layout Properties */}
      <div className="mb-4">
        <h3 className="text-md font-semibold mb-2">Layout</h3>
        <div className="mb-4">
          <label className="block text-sm font-medium">Layout Mode</label>
          <select
            value={selectedItem.layoutMode || "absolute"}
            onChange={(e) =>
              updateItem(selectedItem.id, {
                layoutMode: e.target.value as "absolute" | "flex" | "grid",
              })
            }
            className="mt-1 block w-full border border-gray-300 rounded p-2"
          >
            <option value="absolute" className="text-black">
              Absolute
            </option>
            <option value="flex" className="text-black">
              Flexbox
            </option>
            <option value="grid" className="text-black">
              Grid
            </option>
          </select>
        </div>
        {selectedItem.layoutMode !== "absolute" && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium">
                Justify Content
              </label>
              <select
                value={selectedItem.justifyContent || "flex-start"}
                onChange={(e) =>
                  updateItem(selectedItem.id, {
                    justifyContent: e.target.value as
                      | "flex-start"
                      | "center"
                      | "flex-end"
                      | "space-between"
                      | "space-around",
                  })
                }
                className="mt-1 block w-full border border-gray-300 rounded p-2"
              >
                <option value="flex-start" className="text-black">
                  Flex Start
                </option>
                <option value="center" className="text-black">
                  Center
                </option>
                <option value="flex-end" className="text-black">
                  Flex End
                </option>
                <option value="space-between" className="text-black">
                  Space Between
                </option>
                <option value="space-around" className="text-black">
                  Space Around
                </option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Align Items</label>
              <select
                value={selectedItem.alignItems || "flex-start"}
                onChange={(e) =>
                  updateItem(selectedItem.id, {
                    alignItems: e.target.value as
                      | "flex-start"
                      | "center"
                      | "flex-end"
                      | "stretch",
                  })
                }
                className="mt-1 block w-full border border-gray-300 rounded p-2"
              >
                <option value="flex-start" className="text-black">
                  Flex Start
                </option>
                <option value="center" className="text-black">
                  Center
                </option>
                <option value="flex-end" className="text-black">
                  Flex End
                </option>
                <option value="stretch" className="text-black">
                  Stretch
                </option>
              </select>
            </div>
            {selectedItem.layoutMode === "grid" && (
              <div className="mb-4">
                <label className="block text-sm font-medium">
                  Number of Columns
                </label>
                <input
                  type="number"
                  value={selectedItem.columnSpan || 1}
                  onChange={(e) =>
                    updateItem(selectedItem.id, {
                      columnSpan: Number(e.target.value),
                    })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded p-2"
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Component-Specific properties */}
      {specificDefinitions.length > 0 && (
        <div className="mb-4">
          <h3 className="text-md font-semibold mb-2">Component Specific</h3>
          {specificDefinitions.map((field) => (
            <div key={field.property as string} className="mb-4">
              <label className="block text-sm font-medium">{field.label}</label>
              {field.type === "text" && (
                <input
                  type="text"
                  value={
                    (selectedItem[field.property] as string) ??
                    (field.defaultValue as string) ??
                    ""
                  }
                  onChange={(e) =>
                    updateItem(selectedItem.id, {
                      [field.property]: e.target.value,
                    } as Partial<DroppedItem>)
                  }
                  className="mt-1 block w-full border border-gray-300 rounded p-2"
                />
              )}
              {field.type === "number" && (
                <input
                  type="number"
                  value={
                    selectedItem[field.property] !== undefined
                      ? Number(selectedItem[field.property])
                      : field.defaultValue !== undefined
                      ? Number(field.defaultValue)
                      : 0
                  }
                  onChange={(e) =>
                    updateItem(selectedItem.id, {
                      [field.property]: Number(e.target.value),
                    } as Partial<DroppedItem>)
                  }
                  className="mt-1 block w-full border border-gray-300 rounded p-2"
                />
              )}
              {field.type === "color" && (
                <input
                  type="color"
                  value={
                    (selectedItem[field.property] as string) ??
                    (field.defaultValue as string) ??
                    "#000000"
                  }
                  onChange={(e) =>
                    updateItem(selectedItem.id, {
                      [field.property]: e.target.value,
                    } as Partial<DroppedItem>)
                  }
                  className="mt-1 block w-full border border-gray-300 rounded p-2"
                />
              )}
              {field.type === "boolean" && (
                <input
                  type="checkbox"
                  checked={
                    selectedItem[field.property] !== undefined
                      ? Boolean(selectedItem[field.property])
                      : field.defaultValue !== undefined
                      ? Boolean(field.defaultValue)
                      : false
                  }
                  onChange={(e) =>
                    updateItem(selectedItem.id, {
                      [field.property]: e.target.checked,
                    } as Partial<DroppedItem>)
                  }
                  className="mt-1"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
