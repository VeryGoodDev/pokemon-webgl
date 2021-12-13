import type EntityRenderer from '../render/EntityRenderer'
import type { EntityUpdateData } from '../scenes/SceneManager'
import type { Vec2 } from '../util'
import { getUniqueId } from '../util'

abstract class Entity {
  name: string
  position: Vec2
  #id: string

  constructor(name: string, position: Vec2) {
    this.name = name
    this.position = position
    this.#id = getUniqueId()
  }

  abstract draw(entityRenderer: EntityRenderer): void
  abstract update(updateData: EntityUpdateData): void
}

export default Entity
