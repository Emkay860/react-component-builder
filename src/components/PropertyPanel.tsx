'use client'
import type { CanvasElement } from '../types'

type Props = {
  selectedElement?: CanvasElement
  updateElement: (id: string, updatedProps: Partial<CanvasElement['props']>) => void
}

export default function PropertyPanel({ selectedElement, updateElement }: Props) {
  if (!selectedElement) {
    return (
      <div className="w-60 bg-gray-100 border-l p-4 flex-shrink-0 text-gray-500 italic">
        No element selected
      </div>
    )
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    updateElement(selectedElement.id, { [name]: value })
  }

  return (
    <div className="w-60 bg-gray-100 border-l p-4 flex-shrink-0">
      <h2 className="text-lg font-semibold mb-4 text-gray-900">Properties</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Text</label>
        <input
          name="text"
          value={selectedElement.props.text}
          onChange={handleChange}
          className="w-full border rounded px-2 py-1"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Background Color</label>
        <input
          name="bgColor"
          value={selectedElement.props.bgColor}
          onChange={handleChange}
          className="w-full border rounded px-2 py-1"
          placeholder="e.g. red-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Text Color</label>
        <input
          name="textColor"
          value={selectedElement.props.textColor}
          onChange={handleChange}
          className="w-full border rounded px-2 py-1"
          placeholder="e.g. white"
        />
      </div>
    </div>
  )
}
