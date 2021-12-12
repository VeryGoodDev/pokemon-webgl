import type BackgroundRenderer from '../BackgroundRenderer'
import Layer from './Layer'
import { Colors } from '../../constants'

class BackgroundLayer extends Layer {
  #backgroundRenderer: BackgroundRenderer

  // TODO: This should eventually take in some kind of SceneManager that can provide the draw method with what color to draw with
  constructor(backgroundRenderer: BackgroundRenderer) {
    super()
    this.#backgroundRenderer = backgroundRenderer
  }
  draw(): void {
    this.#backgroundRenderer.renderBackground(Colors.OUT_OF_BOUNDS_BACKGROUND)
  }
}

export default BackgroundLayer
