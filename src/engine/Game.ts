import type ShaderProgram from '../render/ShaderProgram'

export default class Game {
  #shaderProgram: ShaderProgram

  constructor(shaderProgram: ShaderProgram) {
    this.#shaderProgram = shaderProgram
  }
  draw() {
    this.#shaderProgram.resetCanvas(`#bada55`)
  }
  async runLoop(): Promise<void> {
    // TODO: Update entities once there are any
    // this.update() or something
    this.draw()
    requestAnimationFrame(() => this.runLoop())
  }
}
