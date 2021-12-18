import type SceneManager from '../../scenes/SceneManager'
import type BackgroundRenderer from '../BackgroundRenderer'
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
    // if (scene.isDirty) {
    scene.drawBackground(this.#backgroundRenderer)
    scene.drawEntities(this.#entityRenderer)
    scene.setClean()
    // }
  }
}

export default PrimaryLayer
