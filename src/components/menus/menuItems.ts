//src/components/menus/menuItems.ts
import type { MenuItem } from "./ContextMenu";

export const getDefaultMenuItems = (
  id: string,
  onDelete: (id: string) => void,
  onDuplicate: (id: string) => void
): MenuItem[] => {
  return [
    {
      label: "Duplicate",
      onClick: () => onDuplicate(id),
    },
    {
      label: "Delete",
      onClick: () => onDelete(id),
    },
  ];
};
