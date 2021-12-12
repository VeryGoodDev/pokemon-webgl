import { Vec2 } from '../../util'
import type CharacterRenderer from '../CharacterRenderer'
import { Facing, SpriteColors } from '../spriteInfo/overworld-characters'
import Layer from './Layer'

class PrimaryLayer extends Layer {
  #characterRenderer: CharacterRenderer
  // TODO: Eventually this should take in a SceneManager or something along those lines, where it would handle swapping a Scene, and a Scene would contain background data, entities, etc.
  constructor(characterRenderer: CharacterRenderer) {
    super()
    this.#characterRenderer = characterRenderer
  }

  draw(): void {
    this.#characterRenderer.renderCharacter(`PLAYER_MALE`, {
      position: new Vec2(16, 64),
      color: SpriteColors.RED,
      facing: Facing.SIDE,
      // isWalking: this.#isWalking,
      // mirrorX: goingRight,
    })
    // this.#isWalking = !this.#isWalking
  }
}

export default PrimaryLayer
