'use client'
import { useDraggable } from '@dnd-kit/core'

export default function Sidebar() {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: 'button',
    data: { type: 'button' },
  })

  return (
    <div className="w-48 bg-gray-100 border-r p-4 flex-shrink-0">
      <h2 className="text-xl font-semibold mb-4 text-gray-900">Components</h2>
      <div
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        className="cursor-grab bg-white border border-gray-300 rounded p-2 mb-2 shadow text-gray-900 hover:bg-gray-100"
      >
        Button
      </div>
    </div>
  )
}