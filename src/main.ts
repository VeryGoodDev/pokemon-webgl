import Game from './engine/Game'
import BackgroundRenderer from './render/BackgroundRenderer'
import { createCharacterRenderer } from './render/CharacterRenderer'
import { createShaderProgram } from './render/ShaderProgram'
import { Facing, SpriteColors } from './render/spriteInfo/overworld-characters'
import { createTextRenderer } from './render/TextRenderer'
import { loadFile, Vec2 } from './util'

async function main() {
  const canvas: HTMLCanvasElement = document.querySelector(`.screen`)
  const webgl = canvas.getContext(`webgl2`)
  // FIXME Show error on-screen somewhere
  if (webgl === null) {
    console.error(`WebGL2 is not supported by your browser or device`)
    return
  }

  const [vertexShaderSource, fragmentShaderSource] = await Promise.all([
    loadFile(`src/assets/shaders/vertex.glsl`),
    loadFile(`src/assets/shaders/fragment.glsl`),
  ])

  // The main program this game engine will use all over the place
  const shaderProgram = createShaderProgram(webgl, vertexShaderSource, fragmentShaderSource)
  shaderProgram.init()
  const [textRenderer, characterRenderer] = await Promise.all([
    createTextRenderer(shaderProgram),
    createCharacterRenderer(shaderProgram),
  ])
  const backgroundRenderer = new BackgroundRenderer(shaderProgram)
  let x = 1
  let isWalking = true
  let goingRight = true
  const loop = () => {
    shaderProgram.resetCanvas(`#0001`)
    backgroundRenderer.renderBackground(`#6969`)
    characterRenderer.renderCharacter(`PLAYER_MALE`, {
      position: new Vec2(x, 64),
      color: SpriteColors.RED,
      facing: Facing.SIDE,
      isWalking,
      mirrorX: goingRight,
    })
    textRenderer.renderLine(`Kira is the best`, new Vec2(8, 112))
    textRenderer.renderLine(`Stardust is pretty`, new Vec2(8, 128))
    if (x > 144) {
      goingRight = false
    }
    if (x < 1) {
      goingRight = true
    }
    x = goingRight ? x + 1 : x - 1
    if (x % 12 === 0) {
      isWalking = !isWalking
    }
    requestAnimationFrame(loop)
  }
  loop()
  // const game = new Game(shaderProgram)
  // game.runLoop()
}
main()
