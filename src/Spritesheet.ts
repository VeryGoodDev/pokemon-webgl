import type { Size } from './util'
import { Vec2 } from './util'

interface StoredSpriteData {
  offset: Vec2
  size: Size
}
export type SpriteData = StoredSpriteData & { image: TexImageSource }

// Based heavily on the Spritesheet class from MethMethMethod's Super Mario JS tutorial. Source code for that https://github.com/meth-meth-method/super-mario
class Spritesheet {
  #image: TexImageSource
  #size: Size
  #spriteData: Map<string, StoredSpriteData>

  constructor(image: TexImageSource, size: Size) {
    this.#image = image
    this.#size = size
    this.#spriteData = new Map()
  }

  get image() {
    return this.#image
  }

  define(name: string, offset: Vec2, size: Size): void {
    this.#spriteData.set(name, { offset, size })
  }
  defineSprite(name: string, offset: Vec2): void {
    this.define(name, offset, this.#size)
  }
  getSpriteData(name: string): SpriteData {
    if (!this.isDefined(name)) {
      throw new Error(`[Spritesheet::getSpriteData()] No sprite defined with name ${name}`)
    }
    const { offset, size } = this.#spriteData.get(name)
    return {
      offset: new Vec2(offset.x * size.width, offset.y * size.height),
      size,
      image: this.#image,
    }
  }
  isDefined(name: string) {
    return this.#spriteData.has(name)
  }
}

export default Spritesheet
