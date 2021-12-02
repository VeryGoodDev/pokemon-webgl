/* eslint-disable no-bitwise */
export function degToRad(degrees: number): number {
  return degrees * (Math.PI / 180)
}
export function radToDeg(radians: number): number {
  return radians * (180 / Math.PI)
}

export function isPowerOf2(num: number): boolean {
  return (num & (num - 1)) === 0
}
