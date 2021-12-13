import type BackdropRenderer from '../BackdropRenderer'
import Layer from './Layer'
import { Colors } from '../../constants'

class BackdropLayer extends Layer {
  #backdropRenderer: BackdropRenderer

  // TODO: This should eventually take in some kind of SceneManager that can provide the draw method with what color to draw with
  constructor(backdropRenderer: BackdropRenderer) {
    super()
    this.#backdropRenderer = backdropRenderer
  }
  draw(): void {
    this.#backdropRenderer.renderBackdrop(Colors.OUT_OF_BOUNDS_BACKGROUND)
  }
}

export default BackdropLayer
