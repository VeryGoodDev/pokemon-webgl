import Layer from './Layer'

class TextLayer extends Layer {
  draw(): void {
    if (this.draw) {
      console.log(`Draw text`)
    }
  }
}

export default TextLayer
