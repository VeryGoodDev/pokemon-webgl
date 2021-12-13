import type Entity from '../entities/Entity'
import BackgroundRenderer from '../render/BackgroundRenderer'
import EntityRenderer from '../render/EntityRenderer'
import { Size, Vec2 } from '../util'

export interface SceneData {
  entities: Entity[]
  background: TexImageSource
}

class Scene {
  #sceneData: SceneData

  constructor(sceneData: SceneData) {
    this.#sceneData = sceneData
  }

  drawBackground(renderer: BackgroundRenderer): void {
    const image = this.#sceneData.background
    renderer.renderBackground(this.#sceneData.background, {
      position: new Vec2(16, 16),
      offset: new Vec2(0, 0),
      size: new Size(image.width, image.height),
    })
  }
  drawEntities(renderer: EntityRenderer): void {
    for (const entity of this.#sceneData.entities) {
      entity.draw(renderer)
    }
  }
  // update(): void {}
}

export default Scene
