import Texture from '../textures'
import type { Vec2 } from '../util'
import { loadImage } from '../util'
import type ShaderProgram from './ShaderProgram'
import {
  CharacterName,
  FacingValue,
  getSpriteByName,
  getSpriteInColor,
  SpriteColor,
  SpriteFrameInfo,
  SpriteFrames,
} from './spriteInfo/overworld-characters'

interface RenderCharacterOptions {
  color: SpriteColor
  facing: FacingValue
  isWalking?: boolean
  position: Vec2
}

function createKey(name: CharacterName, facing: FacingValue, color: SpriteColor): string {
  return `${name}.${facing}.${color}`
}

class CharacterRenderer {
  #shaderProgram: ShaderProgram
  #texture: Texture
  #spriteImage: TexImageSource
  #characterSprites: Map<string, SpriteFrames>

  constructor(shaderProgram: ShaderProgram, spriteImage: TexImageSource) {
    this.#shaderProgram = shaderProgram
    this.#texture = new Texture(shaderProgram)
    this.#spriteImage = spriteImage
    this.#characterSprites = new Map()
  }

  #getSpriteData(name: CharacterName, options: RenderCharacterOptions): SpriteFrameInfo {
    const key = createKey(name, options.facing, options.color)
    let spriteData = this.#characterSprites.get(key)
    if (!spriteData) {
      spriteData = getSpriteInColor(getSpriteByName(name, options.facing), options.color)
      this.#characterSprites.set(key, spriteData)
    }
    const [idleSprite, walkingSprite] = spriteData
    return options.isWalking ? walkingSprite : idleSprite
  }
  renderCharacter(spriteName: CharacterName, options: RenderCharacterOptions): void {
    const { offset, size } = this.#getSpriteData(spriteName, options)
    this.#shaderProgram.addImageToRenderQueue(this.#spriteImage, options.position, { offset, size })
    this.#texture.init(WebGL2RenderingContext.TEXTURE0, WebGL2RenderingContext.TEXTURE_2D, this.#spriteImage)
    this.#shaderProgram.renderImagesFromQueue()
  }
}

async function createCharacterRenderer(shaderProgram: ShaderProgram): Promise<CharacterRenderer> {
  const spriteImg = await loadImage(`src/assets/img/sprites/overworld-characters.png`)
  return new CharacterRenderer(shaderProgram, spriteImg)
}

export default CharacterRenderer
export { createCharacterRenderer }
