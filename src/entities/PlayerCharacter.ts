import Entity from './Entity'

enum Direction {
  NORTH = `NORTH`,
  SOUTH = `SOUTH`,
  EAST = `EAST`,
  WEST = `WEST`,
}

// TODO: Entity class, to track entity sprite name, color, internally track facing, handle render, etc.

class PlayerCharacter extends Entity {
  #spriteName: string
  #spriteColor: string
  #facing: Direction

  draw() {
    if (this.draw) {
      // TODO
    }
  }
  update() {
    if (this.update) {
      // TODO
    }
  }
}

export default PlayerCharacter
