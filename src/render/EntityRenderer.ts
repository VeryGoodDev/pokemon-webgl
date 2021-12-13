import Texture from '../textures'
import type { Vec2 } from '../util'
import { loadImage } from '../util'
import type ShaderProgram from './ShaderProgram'
import {
  EntityName,
  FacingValue,
  getSpriteByName,
  getSpriteInColor,
  SpriteColor,
  SpriteFrameInfo,
  SpriteFrames,
} from './spriteInfo/overworld-characters'

interface RenderEntityOptions {
  color: SpriteColor
  facing: FacingValue
  isWalking?: boolean
  mirrorX?: boolean
  mirrorY?: boolean
  position: Vec2
}

function createKey(name: EntityName, facing: FacingValue, color: SpriteColor): string {
  return `${name}.${facing}.${color}`
}

class EntityRenderer {
  #shaderProgram: ShaderProgram
  #texture: Texture
  #spriteImage: TexImageSource
  #entitySprites: Map<string, SpriteFrames>

  constructor(shaderProgram: ShaderProgram, spriteImage: TexImageSource) {
    this.#shaderProgram = shaderProgram
    this.#texture = new Texture(shaderProgram)
    this.#spriteImage = spriteImage
    this.#entitySprites = new Map()
  }

  #getSpriteData(name: EntityName, options: RenderEntityOptions): SpriteFrameInfo {
    const key = createKey(name, options.facing, options.color)
    let spriteData = this.#entitySprites.get(key)
    if (!spriteData) {
      spriteData = getSpriteInColor(getSpriteByName(name, options.facing), options.color)
      this.#entitySprites.set(key, spriteData)
    }
    const [idleSprite, walkingSprite] = spriteData
    return options.isWalking ? walkingSprite : idleSprite
  }
  renderEntity(spriteName: EntityName, options: RenderEntityOptions): void {
    const { position, mirrorX, mirrorY } = options
    const { offset, size } = this.#getSpriteData(spriteName, options)
    this.#shaderProgram.addImageToRenderQueue(this.#spriteImage, position, {
      offset,
      size,
      mirrorX,
      mirrorY,
    })
    this.#texture.init(WebGL2RenderingContext.TEXTURE0, WebGL2RenderingContext.TEXTURE_2D, this.#spriteImage)
    this.#shaderProgram.renderFromQueue()
  }
}

async function createEntityRenderer(shaderProgram: ShaderProgram): Promise<EntityRenderer> {
  const spriteImg = await loadImage(`src/assets/img/sprites/overworld-characters.png`)
  return new EntityRenderer(shaderProgram, spriteImg)
}

export default EntityRenderer
export { createEntityRenderer }
