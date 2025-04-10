'use client'
import { useDraggable } from '@dnd-kit/core';
import { DroppedItem } from '../types';

type Props = {
  item: DroppedItem;
}

export default function CanvasItem({ item }: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: item.id,
  })

  const style = {
    position: 'absolute' as const,
    top: item.y,
    left: item.x,
    transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
    zIndex: item.zIndex || 1,
    cursor: isDragging ? 'grabbing' : 'grab',
  }

  return (
    <button
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="px-3 py-1 bg-blue-500 text-white rounded"
    >
      Button
    </button>
  )
}
