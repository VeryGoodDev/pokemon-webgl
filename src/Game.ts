import PlayerCharacter from './entities/PlayerCharacter'
import KeyboardInput, { DEFAULT_KEY_BINDINGS } from './KeyboardInput'
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

interface GameTimerData {
  accumulatedTime: number
  deltaTime: number
  lastFrameTime: number
}

class Game {
  #shaderProgram: ShaderProgram
  #layerComposer: LayerComposer
  #sceneManager: SceneManager
  #timerData: GameTimerData

  constructor(shaderProgram: ShaderProgram, layerComposer: LayerComposer, sceneManager: SceneManager) {
    this.#shaderProgram = shaderProgram
    this.#layerComposer = layerComposer
    this.#sceneManager = sceneManager

    this.#timerData = {
      accumulatedTime: 0,
      lastFrameTime: null,
      deltaTime: 1 / 60,
    }
  }
  draw() {
    this.#shaderProgram.resetCanvas(`#0001`)
    this.#layerComposer.drawLayers()
  }
  start(): void {
    this.#nextFrame()
  }

  #nextFrame(): void {
    requestAnimationFrame((time) => this.#runLoop(time))
  }
  async #runLoop(time: number): Promise<void> {
    if (this.#timerData.lastFrameTime !== null) {
      const accumlationSinceLastFrame = (time - this.#timerData.lastFrameTime) / 1000
      this.#timerData.accumulatedTime = Math.min(1, accumlationSinceLastFrame)
      const { deltaTime } = this.#timerData
      while (this.#timerData.accumulatedTime > deltaTime) {
        this.#sceneManager.updateScene(deltaTime)
        this.#timerData.accumulatedTime -= deltaTime
      }
      this.draw()
    }
    this.#timerData.lastFrameTime = time
    this.#nextFrame()
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

  const keyboardInput = new KeyboardInput()
  keyboardInput.setKeyBindings(DEFAULT_KEY_BINDINGS)
  keyboardInput.init()

  const sceneManager = new SceneManager(keyboardInput)
  const player = new PlayerCharacter(`Dev`, `PLAYER_MALE`, SpriteColors.RED)
  const playerRoomScene = new Scene({
    player,
    entities: [],
    background: playerRoomBackground,
  })
  sceneManager.setCurrentScene(playerRoomScene)

  // The order in which these are added matters, as the game will render each layer in the order below, with later layers being added on top of previous ones. So they are added in order of back to front
  const layerComposer = new LayerComposer()
  layerComposer.addLayer(new BackdropLayer(backdropRenderer))
  layerComposer.addLayer(new PrimaryLayer(sceneManager, backgroundRenderer, entityRenderer))
  layerComposer.addLayer(new TextLayer(textRenderer))

  return new Game(shaderProgram, layerComposer, sceneManager)
}

export default Game
export { createGame }
