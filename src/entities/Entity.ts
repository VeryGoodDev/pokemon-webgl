import { getUniqueId } from '../util'

abstract class Entity {
  name: string
  #id: string

  constructor(name: string) {
    this.name = name
    this.#id = getUniqueId()
  }

  abstract draw(): void
  abstract update(): void
}

export default Entity
