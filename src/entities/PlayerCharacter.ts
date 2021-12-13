import type EntityRenderer from '../render/EntityRenderer'
import type { EntityName, FacingValue, SpriteColor } from '../render/spriteInfo/overworld-characters'
import { Facing } from '../render/spriteInfo/overworld-characters'
import { Direction, EntityUpdateData } from '../scenes/SceneManager'
import { Vec2 } from '../util'
import Entity from './Entity'

function convertDirectionToFacing(direction: Direction): FacingValue {
  if (direction === Direction.NORTH) {
    return Facing.BACK
  }
  if (direction === Direction.SOUTH) {
    return Facing.FRONT
  }
  return Facing.SIDE
}

// TODO: Entity class, to track entity sprite name, color, internally track facing, handle render, etc.

class PlayerCharacter extends Entity {
  #spriteName: EntityName
  #spriteColor: SpriteColor
  #isOnBike: boolean

  constructor(playerName: string, spriteName: EntityName, spriteColor: SpriteColor) {
    super(playerName, new Vec2(64, 64), Direction.SOUTH)
    this.#spriteName = spriteName
    this.#spriteColor = spriteColor
    this.#isOnBike = false
  }

  draw(entityRenderer: EntityRenderer) {
    entityRenderer.renderEntity(this.#spriteName, {
      color: this.#spriteColor,
      facing: convertDirectionToFacing(this.direction),
      // FIXME: Set to true when direction input is pressed, false when released/finished walking
      isWalking: false,
      mirrorX: this.direction === Direction.EAST,
      position: this.position,
    })
  }
  update(updateData: EntityUpdateData) {
    if (updateData.position) {
      this.position = updateData.position
    }
    if (updateData.direction) {
      this.direction = updateData.direction
    }
  }
}

export default PlayerCharacter
