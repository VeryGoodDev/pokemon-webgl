import { Vec2 } from '../../util'
import TextRenderer from '../TextRenderer'
import Layer from './Layer'

class TextLayer extends Layer {
  #textRenderer: TextRenderer

  // TODO: This should eventually get a TextManager or something, which handles whether to show a text box, what to show, etc.
  constructor(textRenderer: TextRenderer) {
    super()
    this.#textRenderer = textRenderer
  }
  draw(): void {
    if (this.draw) {
      // TODO:
    }
    // this.#textRenderer.renderLine(`Kira is the best`, new Vec2(8, 112))
    // this.#textRenderer.renderLine(`Stardust is pretty`, new Vec2(8, 128))
  }
}

export default TextLayer
