import PlayerCharacter from './entities/PlayerCharacter'
import BackdropRenderer from './render/BackdropRenderer'
import BackgroundRenderer from './render/BackgroundRenderer'
import { createEntityRenderer } from './render/EntityRenderer'
import LayerComposer from './render/LayerComposer'
import BackdropLayer from './render/layers/BackdropLayer'
import PrimaryLayer from './render/layers/PrimaryLayer'
import TextLayer from './render/layers/TextLayer'
import type ShaderProgram from './render/ShaderProgram'
import { SpriteColors } from './render/spriteInfo/overworld-characters'
import { createTextRenderer } from './render/TextRenderer'
import Scene from './scenes/Scene'
import SceneManager from './scenes/SceneManager'
import { loadImage } from './util'

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
  const [textRenderer, entityRenderer, playerRoomBackground] = await Promise.all([
    createTextRenderer(shaderProgram),
    createEntityRenderer(shaderProgram),
    loadImage(`/src/assets/img/backgrounds/player_room.png`),
  ])
  const backdropRenderer = new BackdropRenderer(shaderProgram)
  const backgroundRenderer = new BackgroundRenderer(shaderProgram)

  const sceneManager = new SceneManager()
  const playerRoomScene = new Scene({
    entities: [new PlayerCharacter(`Dev`, `PLAYER_MALE`, SpriteColors.RED)],
    background: playerRoomBackground,
  })
  sceneManager.setCurrentScene(playerRoomScene)

  // The order in which these are added matters, as the game will render each layer in the order below, with later layers being added on top of previous ones. So they are added in order of back to front
  const layerComposer = new LayerComposer()
  layerComposer.addLayer(new BackdropLayer(backdropRenderer))
  layerComposer.addLayer(new PrimaryLayer(sceneManager, backgroundRenderer, entityRenderer))
  layerComposer.addLayer(new TextLayer(textRenderer))

  return new Game(shaderProgram, layerComposer)
}

export default Game
export { createGame }
