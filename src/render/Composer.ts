import Layer from './layers/Layer'
import type ShaderProgram from './ShaderProgram'

class Composer {
  #shaderProgram: ShaderProgram
  #layers: Layer[]

  constructor(shaderProgram: ShaderProgram) {
    this.#shaderProgram = shaderProgram
    this.#layers = []
  }

  addLayer(layer: Layer): void {
    this.#layers.push(layer)
  }
  drawLayers(): void {
    this.#layers.forEach((layer) => {
      layer.draw()
    })
  }
}

export default Composer
