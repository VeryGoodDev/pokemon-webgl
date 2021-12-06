import type { Size } from './util'
import { Vec2 } from './util'

interface SpriteData {
  offset: Vec2
  size: Size
}

// Based heavily on the Spritesheet class from MethMethMethod's Super Mario JS tutorial. Source code for that https://github.com/meth-meth-method/super-mario
export default class Spritesheet {
  #image: TexImageSource
  #size: Size
  #spriteData: Map<string, SpriteData>

  constructor(image: TexImageSource, size: Size) {
    this.#image = image
    this.#size = size
    this.#spriteData = new Map()
  }

  define(name: string, offset: Vec2, size: Size): void {
    this.#spriteData.set(name, { offset, size })
  }
  defineSprite(name: string, offset: Vec2): void {
    this.define(name, offset, this.#size)
  }
  getSpriteData(name: string): SpriteData & { image: TexImageSource } {
    if (!this.#spriteData.has(name)) {
      throw new Error(`[Spritesheet.ts] No sprite defined with name ${name}`)
    }
    const { offset, size } = this.#spriteData.get(name)
    return {
      offset: new Vec2(offset.x * size.width, offset.y * size.height),
      size,
      image: this.#image,
    }
  }
}
