// src/components/PropertyPanel.tsx
"use client";
import {
  componentProperties,
  PropertyField,
} from "../config/componentProperties";
import { pluginRegistry } from "../plugins/PluginRegistry";
import { DroppedItem } from "../types";

type PropertyPanelProps = {
  selectedItem?: DroppedItem;
  updateItem: (id: string, newProps: Partial<DroppedItem>) => void;
  onRenameGroupAlias?: (groupId: string, alias: string) => void;
};

export default function PropertyPanel({
  selectedItem,
  updateItem,
  onRenameGroupAlias,
}: PropertyPanelProps) {
  if (!selectedItem) {
    return (
      <div className="w-64 p-4 border-l text-black">
        <h2 className="text-lg font-bold mb-4">Properties</h2>
        <p className="text-gray-500">No element selected.</p>
      </div>
    );
  }

  // Look up static property definitions from our config…
  const staticProps: PropertyField[] =
    componentProperties[selectedItem.componentType] || [];
  // …and also check the plugin registry for dynamic property definitions
  const pluginProps: PropertyField[] =
    pluginRegistry.getPlugin(selectedItem.componentType)?.properties || [];
  // Merge them, favoring the static definitions if any exist.
  const specificDefinitions =
    staticProps.length > 0 ? staticProps : pluginProps;

  return (
    <div className="w-64 p-4 border-l overflow-y-auto text-black">
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
            value={selectedItem.zIndex ?? 1}
            onChange={(e) =>
              updateItem(selectedItem.id, { zIndex: Number(e.target.value) })
            }
            className="mt-1 block w-full border border-gray-300 rounded p-2"
          />
        </div>
        {selectedItem.groupId && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium">Group Alias</label>
              <input
                type="text"
                value={selectedItem.groupAlias ?? ""}
                onChange={(e) => {
                  if (onRenameGroupAlias) {
                    onRenameGroupAlias(selectedItem.groupId!, e.target.value);
                  }
                }}
                placeholder="(Optional)"
                className="mt-1 block w-full border border-gray-300 rounded p-2 bg-white text-gray-900"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Group ID</label>
              <input
                type="text"
                value={selectedItem.groupId}
                readOnly
                className="mt-1 block w-full border border-gray-300 rounded p-2 bg-gray-100 text-gray-700 cursor-not-allowed"
              />
            </div>
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
