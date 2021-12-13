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
import SceneManager, { Direction } from './scenes/SceneManager'
import { loadImage } from './util'

class Game {
  #shaderProgram: ShaderProgram
  #layerComposer: LayerComposer
  #sceneManager: SceneManager

  constructor(shaderProgram: ShaderProgram, layerComposer: LayerComposer, sceneManager: SceneManager) {
    this.#shaderProgram = shaderProgram
    this.#layerComposer = layerComposer
    this.#sceneManager = sceneManager
  }
  draw() {
    this.#shaderProgram.resetCanvas(`#0001`)
    this.#layerComposer.drawLayers()
  }
  async runLoop(): Promise<void> {
    if (this.#sceneManager.getCurrentScene().isDirty) {
      // TODO: Update entities once there are any
      // this.update() or something
      this.draw()
    }
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
  const player = new PlayerCharacter(`Dev`, `PLAYER_MALE`, SpriteColors.RED)
  const playerRoomScene = new Scene({
    player,
    entities: [],
    background: playerRoomBackground,
  })
  sceneManager.setCurrentScene(playerRoomScene)

  window.addEventListener(`keydown`, (evt) => {
    const oldDirection = player.direction
    let direction = oldDirection
    if (evt.code === `KeyE`) {
      direction = Direction.NORTH
    }
    if (evt.code === `KeyD`) {
      direction = Direction.SOUTH
    }
    if (evt.code === `KeyF`) {
      direction = Direction.EAST
    }
    if (evt.code === `KeyS`) {
      direction = Direction.WEST
    }
    if (direction !== oldDirection) {
      player.update({
        position: player.position,
        direction,
      })
      playerRoomScene.setDirty()
    }
  })

  // The order in which these are added matters, as the game will render each layer in the order below, with later layers being added on top of previous ones. So they are added in order of back to front
  const layerComposer = new LayerComposer()
  layerComposer.addLayer(new BackdropLayer(backdropRenderer))
  layerComposer.addLayer(new PrimaryLayer(sceneManager, backgroundRenderer, entityRenderer))
  layerComposer.addLayer(new TextLayer(textRenderer))

  return new Game(shaderProgram, layerComposer, sceneManager)
}

export default Game
export { createGame }
