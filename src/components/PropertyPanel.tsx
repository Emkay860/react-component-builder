// PropertyPanel.tsx
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
    <div className="w-64 p-4 border-l">
      <h2 className="text-lg font-bold mb-4">Properties</h2>

      {/* General properties common to all elements */}
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
            value={-selectedItem.y} // Inverting, as before
            onChange={(e) =>
              updateItem(selectedItem.id, { y: -Number(e.target.value) })
            }
            className="mt-1 block w-full border border-gray-300 rounded p-2"
          />
        </div>
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
                  value={(selectedItem[field.property] as string) || ""}
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
                  value={Number(selectedItem[field.property]) || 0}
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
                  value={(selectedItem[field.property] as string) || "#000000"}
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
                  checked={Boolean(selectedItem[field.property])}
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
