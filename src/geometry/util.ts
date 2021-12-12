import type { Size, Vec2 } from '../util'

export function getRectangleBufferData(position: Vec2, size: Size, mirrorX = false, mirrorY = false): number[] {
  const x1 = position.x
  const x2 = x1 + size.width
  const y1 = position.y
  const y2 = y1 + size.height

  const xStart = mirrorX ? x2 : x1
  const xEnd = mirrorX ? x1 : x2
  const yStart = mirrorY ? y2 : y1
  const yEnd = mirrorY ? y1 : y2

  return [xStart, yStart, xEnd, yStart, xStart, yEnd, xStart, yEnd, xEnd, yStart, xEnd, yEnd]
}
