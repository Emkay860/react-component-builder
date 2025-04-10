'use client'
import { DndContext, DragEndEvent, DragStartEvent } from '@dnd-kit/core'
import { useState } from 'react'
import Canvas from './components/Canvas'
import Sidebar from './components/Sidebar'
import { DroppedItem } from './types'

export default function App() {
  const [items, setItems] = useState<DroppedItem[]>([])
  const [startCoordinates, setStartCoordinates] = useState<{ x: number; y: number } | null>(null)

  const handleDragStart = (event: DragStartEvent) => {
    // Record the pointer position when the drag starts.
    const mouseEvent = event.activatorEvent as MouseEvent
    setStartCoordinates({
      x: mouseEvent.clientX,
      y: mouseEvent.clientY,
    })
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over, delta } = event
    if (over?.id !== 'canvas' || !startCoordinates) return
  
    const canvas = document.getElementById('canvas-root')
    if (!canvas) return
  
    const canvasRect = canvas.getBoundingClientRect()
    
    // Calculate final drop coordinates relative to the canvas:
    const finalX = startCoordinates.x + delta.x - canvasRect.left
    const finalY = startCoordinates.y + delta.y - canvasRect.top
  
    setItems(prev => [
      ...prev,
      { id: `${active.id}-${Date.now()}`, x: finalX, y: finalY }
    ])
    
    // Optionally clear the startCoordinates if you’re done with this drag
    setStartCoordinates(null)
  }
  
  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex h-screen w-screen">
        <Sidebar />
        <Canvas items={items} />
      </div>
    </DndContext>
  )
}
