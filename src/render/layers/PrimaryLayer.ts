import Layer from './Layer'

class PrimaryLayer extends Layer {
  draw(): void {
    if (this.draw) {
      console.log(`Draw primary`)
    }
  }
}

export default PrimaryLayer
