import { Size, Vec2 } from '../../util'

export interface SpriteFrameInfo {
  offset: Vec2
  size?: Size
}
export type SpriteFrames = [SpriteFrameInfo, SpriteFrameInfo?]

const SpriteColors = {
  RED: `RED`,
  BLUE: `BLUE`,
  GREEN: `GREEN`,
  BROWN: `BROWN`,
  MUTED_RED: `MUTED_RED`,
  GRAYSCALE: `GRAYSCALE`,
} as const
export type SpriteColor = typeof SpriteColors[keyof typeof SpriteColors]
const ColorOffsetVectors: Record<SpriteColor, Vec2> = {
  [SpriteColors.RED]: new Vec2(0, 0),
  [SpriteColors.BLUE]: new Vec2(8, 0),
  [SpriteColors.GREEN]: new Vec2(16, 0),
  [SpriteColors.BROWN]: new Vec2(24, 0),
  [SpriteColors.MUTED_RED]: new Vec2(32, 0),
  [SpriteColors.GRAYSCALE]: new Vec2(40, 0),
}
const Facing = {
  FRONT: `FRONT`,
  BACK: `BACK`,
  SIDE: `SIDE`,
} as const
// Learning new TS shit...keyof typeof Facing gets the keys of `Facing`, then putting all that inside `typeof Facing[all that]` gets the values as a union
export type FacingValue = typeof Facing[keyof typeof Facing]
export type SpriteInfo = Record<FacingValue, SpriteFrames>
const DEFAULT_SPRITE_SIZE = new Size(16, 16)

const OverworldCharacterSprites = {
  PLAYER_MALE: {
    [Facing.FRONT]: [{ offset: new Vec2(0, 0) }, { offset: new Vec2(3, 0) }],
    [Facing.BACK]: [{ offset: new Vec2(1, 0) }, { offset: new Vec2(4, 0) }],
    [Facing.SIDE]: [{ offset: new Vec2(2, 0) }, { offset: new Vec2(5, 0) }],
  },
  PLAYER_MALE_BIKE: {
    [Facing.FRONT]: [{ offset: new Vec2(6, 0) }, { offset: new Vec2(1, 1) }],
    [Facing.BACK]: [{ offset: new Vec2(7, 0) }, { offset: new Vec2(2, 1) }],
    [Facing.SIDE]: [{ offset: new Vec2(0, 1) }, { offset: new Vec2(3, 1) }],
  },
  PLAYER_FEMALE: {
    // TODO
  },
  PLAYER_FEMALE_BIKE: {
    // TODO
  },
} as const

export type CharacterName = keyof typeof OverworldCharacterSprites
function getSpriteByName(name: CharacterName, facing: FacingValue): SpriteFrames {
  return (OverworldCharacterSprites[name][facing] as SpriteFrames).map((frame) => ({
    offset: frame.offset,
    size: frame.size || DEFAULT_SPRITE_SIZE,
  })) as SpriteFrames
}
function getSpriteInColor(spriteInfo: SpriteFrames, color: SpriteColor): SpriteFrames {
  return spriteInfo.map((frame) => ({
    offset: frame.offset.add(ColorOffsetVectors[color]),
    size: frame.size || DEFAULT_SPRITE_SIZE,
  })) as SpriteFrames
}

export { SpriteColors, Facing, DEFAULT_SPRITE_SIZE, getSpriteByName, getSpriteInColor }
