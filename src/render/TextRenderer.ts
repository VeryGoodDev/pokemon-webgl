import Spritesheet from '../Spritesheet'
import { loadImage, Size, Vec2 } from '../util'
import type ShaderProgram from './ShaderProgram'

const CHARACTER_WIDTH = 8
const CHARACTER_HEIGHT = 8
const FONT_CHARACTERS = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-?!/.,×():;[]~~0123456789é'… `
const SPECIAL_CHARACTER_REGEX = /\{\{.+?\}\}/g

function getCharacterArray(text: string): string[] {
  const specialCharacters = text.match(SPECIAL_CHARACTER_REGEX) ?? []
  return text
    .replace(SPECIAL_CHARACTER_REGEX, `~`)
    .split(``)
    .map((character) => {
      if (character === `~`) {
        return specialCharacters.shift()
      }
      return character
    })
}

export default class TextRenderer {
  #shaderProgram: ShaderProgram
  #fontSprites: Spritesheet

  constructor(shaderProgram: ShaderProgram, fontSprites: Spritesheet) {
    this.#shaderProgram = shaderProgram
    this.#fontSprites = fontSprites
  }

  get sprites() {
    return this.#fontSprites
  }

  #addCharacterToQueue(character: string, position: Vec2): void {
    const { image, offset, size } = this.#fontSprites.getSpriteData(character)
    this.#shaderProgram.addImageToRenderQueue(image, position, { offset, size })
  }
  renderText(text: string): void {
    getCharacterArray(text).forEach((character, idx) => {
      this.#addCharacterToQueue(character, new Vec2(idx * CHARACTER_WIDTH, 2))
    })
    this.#shaderProgram.renderImagesFromQueue()
  }
}

function getSpecialCharacterByIndex(offset: Vec2): string {
  if (offset.isEqualTo(new Vec2(1, 8))) {
    return `{{PK}}`
  }
  if (offset.isEqualTo(new Vec2(2, 8))) {
    return `{{MN}}`
  }
  throw new RangeError(
    `[render/TextRenderer.ts] The offset ${offset.toString()} is not known to contain a special character`
  )
}
function defineFontCharacters(fontSprites: Spritesheet, imageSize: Size): void {
  let x = 0
  let y = 0
  for (let character of FONT_CHARACTERS) {
    const offset = new Vec2(x, y)
    // FONT_CHARACTERS uses ~ as the placeholder for non-standarad-Latin characters
    // since the font never uses the character AFAICT
    if (character === `~`) {
      character = getSpecialCharacterByIndex(offset)
    }
    fontSprites.defineSprite(character, offset)
    x += 1
    if (x >= imageSize.width / CHARACTER_WIDTH) {
      x = 0
      y += 1
    }
  }
}
export async function createTextRenderer(shaderProgram: ShaderProgram): Promise<TextRenderer> {
  const fontImage = await loadImage(`src/assets/img/sprites/font.png`)
  const fontSprites = new Spritesheet(fontImage, new Size(CHARACTER_WIDTH, CHARACTER_HEIGHT))
  const imageSize = new Size(fontImage.width, fontImage.height)
  defineFontCharacters(fontSprites, imageSize)
  return new TextRenderer(shaderProgram, fontSprites)
}
