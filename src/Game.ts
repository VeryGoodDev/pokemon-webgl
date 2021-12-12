import BackgroundRenderer from './render/BackgroundRenderer'
import { createCharacterRenderer } from './render/CharacterRenderer'
import LayerComposer from './render/LayerComposer'
import BackgroundLayer from './render/layers/BackgroundLayer'
import PrimaryLayer from './render/layers/PrimaryLayer'
import TextLayer from './render/layers/TextLayer'
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
    this.#layerComposer.drawLayers()
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
  const backgroundRenderer = new BackgroundRenderer(shaderProgram)

  // The order in which these are added matters, as the game will render each layer in the order below, with later layers being added on top of previous ones. So they are added in order of back to front
  const layerComposer = new LayerComposer()
  layerComposer.addLayer(new BackgroundLayer(backgroundRenderer))
  layerComposer.addLayer(new PrimaryLayer(characterRenderer))
  layerComposer.addLayer(new TextLayer(textRenderer))

  return new Game(shaderProgram, layerComposer)
}

export default Game
export { createGame }
