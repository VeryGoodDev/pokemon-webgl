import type ShaderProgram from './shaders/ShaderProgram'
import { uploadImageToTexture } from './webgl-util'

export default class Texture {
  #currentlyBoundTarget: number
  #shaderProgram: ShaderProgram
  #texture: WebGLTexture
  #webgl: WebGL2RenderingContext

  constructor(shaderInfo: ShaderProgram) {
    this.#shaderProgram = shaderInfo
    this.#webgl = this.#shaderProgram.webgl
    this.#texture = this.#webgl.createTexture()
    this.#currentlyBoundTarget = null
  }

  activate(textureUnit: number): void {
    this.#webgl.activeTexture(textureUnit)
  }
  bind(target: number): void {
    this.#webgl.bindTexture(target, this.#texture)
    this.#currentlyBoundTarget = target
  }
  upload(textureImage: TexImageSource, options = {}): void {
    uploadImageToTexture(this.#webgl, this.#currentlyBoundTarget, textureImage, options)
  }

  // draw(): void {}
}
