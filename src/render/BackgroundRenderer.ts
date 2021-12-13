import Texture from '../textures'
import { Size, Vec2 } from '../util'
import type ShaderProgram from './ShaderProgram'

interface BackgroundOptions {
  position: Vec2
  offset: Vec2
  size: Size
}

class BackgroundRenderer {
  #shaderProgram: ShaderProgram
  #texture: Texture

  constructor(shaderProgram: ShaderProgram) {
    this.#shaderProgram = shaderProgram
    this.#texture = new Texture(shaderProgram)
  }

  renderBackground(image: TexImageSource, options: BackgroundOptions): void {
    this.#shaderProgram.addImageToRenderQueue(image, options.position, {
      offset: options.offset,
      size: options.size,
    })
    this.#texture.init(WebGL2RenderingContext.TEXTURE0, WebGL2RenderingContext.TEXTURE_2D, image)
    this.#shaderProgram.renderFromQueue()
  }
}

export default BackgroundRenderer
