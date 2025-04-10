'use client'
import { useDraggable } from '@dnd-kit/core';

interface SidebarItemProps {
  id: string;
  componentType: string;
  name: string;
}

export default function SidebarItem({
  id,
  componentType,
  name,
}: SidebarItemProps) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id,
    data: { componentType },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="cursor-grab bg-white border border-gray-300 rounded p-2 mb-2 shadow text-gray-900 hover:bg-gray-100"
    >
      {name}
    </div>
  );
}
