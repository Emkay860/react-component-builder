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
      className="p-3 bg-white rounded shadow cursor-move hover:bg-blue-50 flex items-center justify-between"
    >
      <span className="text-gray-700 font-medium">{name}</span>
      <svg
        className="w-4 h-4 text-gray-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 8h16M4 16h16"
        />
      </svg>
    </div>
  );
}
