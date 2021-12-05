import type ShaderProgram from './shaders/ShaderProgram'
import {
  disableTextureMagnification,
  disableTextureMipmapping,
  disableTextureWrapping,
  uploadColorToTexture,
  uploadImageToTexture,
} from './webgl-util'

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
  enableOpinionatedSettings(): void {
    disableTextureWrapping(this.#webgl, this.#currentlyBoundTarget)
    disableTextureMipmapping(this.#webgl, this.#currentlyBoundTarget)
    disableTextureMagnification(this.#webgl, this.#currentlyBoundTarget)
  }
  uploadColor(color: Uint8Array, options = {}): void {
    uploadColorToTexture(this.#webgl, this.#currentlyBoundTarget, color, options)
  }
  uploadImage(textureImage: TexImageSource, options = {}): void {
    uploadImageToTexture(this.#webgl, this.#currentlyBoundTarget, textureImage, options)
  }
  init(
    textureUnitToActivate: number,
    targetToBind: number,
    texture: TexImageSource | Uint8Array,
    { doNotUseOpinionatedSettings = false, ...uploadOptions } = {}
  ): void {
    this.activate(textureUnitToActivate)
    this.bind(targetToBind)
    if (!doNotUseOpinionatedSettings) {
      this.enableOpinionatedSettings()
    }
    if (texture instanceof Uint8Array) {
      this.uploadColor(texture, uploadOptions)
    } else {
      this.uploadImage(texture, uploadOptions)
    }
  }
}
