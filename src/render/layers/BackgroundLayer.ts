import Layer from './Layer'

class BackgroundLayer extends Layer {
  draw(): void {
    if (this.draw) {
      console.log(`Draw background`)
    }
  }
}

export default BackgroundLayer
