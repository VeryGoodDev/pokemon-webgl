import ShaderProgram from './shaders/ShaderProgram'

export default class Texture {
  #shaderInfo: ShaderProgram

  constructor(shaderInfo: ShaderProgram) {
    this.#shaderInfo = shaderInfo
  }

  // draw(): void {}
}
