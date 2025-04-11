// src/components/menus/menuItems.ts
import type { MenuItem } from "./ContextMenu";

// This function accepts the target item id and an onDelete callback,
// then returns an array of menu items.
export const getDefaultMenuItems = (
  id: string,
  onDelete: (id: string) => void
): MenuItem[] => {
  return [
    {
      label: "Delete",
      onClick: () => {
        onDelete(id);
      },
    },
    // In the future, add more menu items here:
    // { label: "Edit", onClick: () => { ... } },
    // { label: "Duplicate", onClick: () => { ... } },
  ];
};
