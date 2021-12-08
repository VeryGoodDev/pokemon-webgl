import { Size, Vec2 } from '../../util'

export interface SpriteFrameInfo {
  offset: Vec2
  size?: Size
}

const ColorOffsets = {
  RED: new Vec2(0, 0),
  BLUE: new Vec2(8, 0),
  GREEN: new Vec2(16, 0),
  BROWN: new Vec2(24, 0),
  MUTED_RED: new Vec2(32, 0),
  GRAYSCALE: new Vec2(40, 0),
}
const Facing = {
  FRONT: `FRONT`,
  BACK: `BACK`,
  SIDE: `SIDE`,
} as const
// Learning new TS shit...keyof typeof Facing gets the keys of `Facing`, then putting all that inside `typeof Facing[all that]` gets the values as a union
type SpriteInfoKey = typeof Facing[keyof typeof Facing]
export type SpriteInfo = Record<SpriteInfoKey, SpriteFrameInfo[]>
const STANDARD_SPRITE_SIZE = new Size(16, 16)

const OverworldCharacterSprites = {
  PLAYER_MALE: {
    [Facing.FRONT]: [{ offset: new Vec2(0, 0) }, { offset: new Vec2(0, 3) }],
    [Facing.BACK]: [{ offset: new Vec2(0, 1) }, { offset: new Vec2(0, 4) }],
    [Facing.SIDE]: [{ offset: new Vec2(0, 2) }, { offset: new Vec2(0, 5) }],
  },
  PLAYER_MALE_BIKE: {
    [Facing.FRONT]: [{ offset: new Vec2(0, 6) }, { offset: new Vec2(1, 1) }],
    [Facing.BACK]: [{ offset: new Vec2(0, 7) }, { offset: new Vec2(1, 2) }],
    [Facing.SIDE]: [{ offset: new Vec2(1, 0) }, { offset: new Vec2(1, 3) }],
  },
  PLAYER_FEMALE: {
    // TODO
  },
  PLAYER_FEMALE_BIKE: {
    // TODO
  },
}

export { ColorOffsets, Facing, STANDARD_SPRITE_SIZE, OverworldCharacterSprites }
