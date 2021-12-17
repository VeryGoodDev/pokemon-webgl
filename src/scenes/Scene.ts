import type Entity from '../entities/Entity'
import type PlayerCharacter from '../entities/PlayerCharacter'
import type BackgroundRenderer from '../render/BackgroundRenderer'
import type EntityRenderer from '../render/EntityRenderer'
import type { SceneState } from './SceneManager'
import { Size, Vec2 } from '../util'
import { Direction } from './SceneManager'

export interface SceneData {
  player: PlayerCharacter
  entities: Entity[]
  background: TexImageSource
}

function calculateNewPosition(player: PlayerCharacter, direction: Direction): Vec2 {
  let { x, y } = player.position
  switch (direction) {
    case Direction.NORTH:
      y -= 16
      break
    case Direction.SOUTH:
      y += 16
      break
    case Direction.WEST:
      x -= 16
      break
    case Direction.EAST:
      x += 16
      break
  }
  return new Vec2(x, y)
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
  drawScene(backgroundRenderer: BackgroundRenderer, entityRenderer: EntityRenderer): void {
    if (this.#isDirty) {
      this.drawBackground(backgroundRenderer)
      this.drawEntities(entityRenderer)
      this.setClean()
    }
  }
  setClean(): void {
    this.#isDirty = false
  }
  setDirty(): void {
    this.#isDirty = true
  }
  update(sceneState: SceneState): void {
    if (sceneState.playerIsMoving) {
      const direction = sceneState.currentDirection
      this.#sceneData.player.update({
        position: calculateNewPosition(this.#sceneData.player, direction),
        direction,
      })
      this.setDirty()
    }
  }
}

export default Scene
