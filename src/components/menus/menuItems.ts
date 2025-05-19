//src/components/menus/menuItems.ts
import type { DroppedItem } from "../../types";

export interface MenuItem {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export const getDefaultMenuItems = (
  id: string,
  onDelete: (id: string) => void,
  onDuplicate: (id: string) => void,
  selectedIds: string[],
  items: DroppedItem[],
  onGroup: () => void,
  onUngroup: () => void
): MenuItem[] => {
  const canGroup = selectedIds.length > 1;
  const canUngroup = selectedIds.some((selId) =>
    items.find((it) => it.id === selId && it.groupId)
  );
  return [
    {
      label: "Delete",
      onClick: () => onDelete(id),
      disabled: false,
    },
    {
      label: "Duplicate",
      onClick: () => onDuplicate(id),
      disabled: false,
    },
    {
      label: "Group",
      onClick: onGroup,
      disabled: !canGroup,
    },
    {
      label: "Ungroup",
      onClick: onUngroup,
      disabled: !canUngroup,
    },
  ];
};
