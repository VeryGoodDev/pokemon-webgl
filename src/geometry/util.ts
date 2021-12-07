import type { Size, Vec2 } from '../util'

export function getRectangleBufferData(position: Vec2, size: Size): number[] {
  const xStart = position.x
  const xEnd = xStart + size.width
  const yStart = position.y
  const yEnd = yStart + size.height
  return [xStart, yStart, xEnd, yStart, xStart, yEnd, xStart, yEnd, xEnd, yStart, xEnd, yEnd]
}
