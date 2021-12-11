import { createCharacterRenderer } from './render/CharacterRenderer'
import LayerComposer from './render/LayerComposer'
import BackgroundLayer from './render/layers/BackgroundLayer'
import type ShaderProgram from './render/ShaderProgram'
import { createTextRenderer } from './render/TextRenderer'

class Game {
  #shaderProgram: ShaderProgram
  #layerComposer: LayerComposer

  constructor(shaderProgram: ShaderProgram, layerComposer: LayerComposer) {
    this.#shaderProgram = shaderProgram
    this.#layerComposer = layerComposer
  }
  draw() {
    this.#shaderProgram.resetCanvas(`#0001`)
  }
  async runLoop(): Promise<void> {
    // TODO: Update entities once there are any
    // this.update() or something
    this.draw()
    requestAnimationFrame(() => this.runLoop())
  }
}

async function createGame(shaderProgram: ShaderProgram): Promise<Game> {
  const [textRenderer, characterRenderer] = await Promise.all([
    createTextRenderer(shaderProgram),
    createCharacterRenderer(shaderProgram),
  ])
  const layerComposer = new LayerComposer()
  layerComposer.addLayer(new BackgroundLayer(shaderProgram))
  // TODO: Primary layer
  // TODO: Text layer
  return new Game(shaderProgram, layerComposer)
}

export default Game
export { createGame }
