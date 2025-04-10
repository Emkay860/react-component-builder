export interface CanvasElement {
    id: string
    type: 'card' | 'text' | 'button'
    x: number
    y: number
    props: {
      text?: string
      bgColor?: string
      textColor?: string
    }
  }
  
  
export type DroppedItem = { id: string; x: number; y: number }