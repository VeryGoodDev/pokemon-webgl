// import { randomFromRange } from '../math/util'

// FIXME Make it so this also sets what buffer binds to ARRAY_BUFFER
export function drawRectangle(
  webgl: WebGL2RenderingContext,
  x: number,
  y: number,
  width: number,
  height: number
): void {
  const x1 = x
  const x2 = x + width
  const y1 = y
  const y2 = y + height

  // Push the buffer in for the two parallel triangles
  webgl.bufferData(
    webgl.ARRAY_BUFFER,
    new Float32Array([x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2]),
    webgl.STATIC_DRAW
  )

  // Set a random color for now
  // webgl.uniform4f(
  //   colorLocation,
  //   randomFromRange(10, 90) / 100,
  //   randomFromRange(10, 90) / 100,
  //   randomFromRange(10, 90) / 100,
  //   randomFromRange(25, 75) / 100
  // )

  webgl.drawArrays(webgl.TRIANGLES, 0, 6)
}
