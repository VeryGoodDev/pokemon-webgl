import Texture from '../textures'
import { Vec2 } from '../util'
import { convertHexToBits } from '../webgl-util'
import ShaderProgram from './ShaderProgram'

class BackgroundRenderer {
  #shaderProgram: ShaderProgram
  #texture: Texture

  constructor(shaderProgram: ShaderProgram) {
    this.#shaderProgram = shaderProgram
    this.#texture = new Texture(shaderProgram)
  }

  renderBackground(color: string): void {
    const colorBits = convertHexToBits(color)
    this.#shaderProgram.addColorToRenderQueue(new Vec2(0, 0))
    this.#texture.init(
      WebGL2RenderingContext.TEXTURE0,
      WebGL2RenderingContext.TEXTURE_2D,
      new Uint8Array(colorBits.map((bit) => bit * 255))
    )
    this.#shaderProgram.renderFromQueue()
  }
}

export default BackgroundRenderer
