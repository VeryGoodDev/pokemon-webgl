import type Entity from '../entities/Entity'
import type PlayerCharacter from '../entities/PlayerCharacter'
import type BackgroundRenderer from '../render/BackgroundRenderer'
import type EntityRenderer from '../render/EntityRenderer'
import { Size, Vec2 } from '../util'

export interface SceneData {
  player: PlayerCharacter
  entities: Entity[]
  background: TexImageSource
}

class Scene {
  #sceneData: SceneData
  #isDirty: boolean

  constructor(sceneData: SceneData) {
    this.#sceneData = sceneData
    this.#isDirty = true
  }

  get isDirty(): boolean {
    return this.#isDirty
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
    this.#sceneData.player.draw(renderer)
    for (const entity of this.#sceneData.entities) {
      entity.draw(renderer)
    }
  }
  setClean(): void {
    this.#isDirty = false
  }
  setDirty(): void {
    this.#isDirty = true
  }
  // update(): void {}
}

export default Scene
