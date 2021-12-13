import type EntityRenderer from '../render/EntityRenderer'
import type { Direction, EntityUpdateData } from '../scenes/SceneManager'
import type { Vec2 } from '../util'
import { getUniqueId } from '../util'

abstract class Entity {
  name: string
  direction: Direction
  position: Vec2
  #id: string

  constructor(name: string, position: Vec2, direction: Direction) {
    this.name = name
    this.position = position
    this.direction = direction
    this.#id = getUniqueId()
  }

  abstract draw(entityRenderer: EntityRenderer): void
  abstract update(updateData: EntityUpdateData): void
}

export default Entity
