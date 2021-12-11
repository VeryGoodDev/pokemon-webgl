import Layer from './layers/Layer'

class LayerComposer {
  #layers: Layer[]

  constructor() {
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

export default LayerComposer
