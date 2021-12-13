import SceneManager from '../../scenes/SceneManager'
import BackgroundRenderer from '../BackgroundRenderer'
import type EntityRenderer from '../EntityRenderer'
import Layer from './Layer'

class PrimaryLayer extends Layer {
  #sceneManager: SceneManager
  #backgroundRenderer: BackgroundRenderer
  #entityRenderer: EntityRenderer

  constructor(sceneManager: SceneManager, backgroundRenderer: BackgroundRenderer, entityRenderer: EntityRenderer) {
    super()
    this.#sceneManager = sceneManager
    this.#backgroundRenderer = backgroundRenderer
    this.#entityRenderer = entityRenderer
  }

  draw(): void {
    const scene = this.#sceneManager.getCurrentScene()
    scene.drawBackground(this.#backgroundRenderer)
    scene.drawEntities(this.#entityRenderer)
  }
}

export default PrimaryLayer
