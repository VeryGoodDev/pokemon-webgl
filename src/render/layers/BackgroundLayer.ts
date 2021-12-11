import BackgroundRenderer from '../BackgroundRenderer'
import ShaderProgram from '../ShaderProgram'
import Layer from './Layer'
import { Colors } from '../../constants'

class BackgroundLayer extends Layer {
  #backgroundRenderer: BackgroundRenderer

  constructor(shaderProgram: ShaderProgram) {
    super()
    this.#backgroundRenderer = new BackgroundRenderer(shaderProgram)
  }
  draw(): void {
    this.#backgroundRenderer.renderBackground(Colors.OUT_OF_BOUNDS_BACKGROUND)
  }
}

export default BackgroundLayer
