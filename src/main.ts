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
  shaderProgram.use()
  shaderProgram.setResolutionThroughUniform(`uResolution`)
  shaderProgram.specifyTextureThroughUniform(`uImage`, 0)
  webgl.enable(webgl.BLEND)
  webgl.blendFunc(webgl.ONE, webgl.ONE_MINUS_SRC_ALPHA)
  const [textRenderer, characterRenderer] = await Promise.all([
    createTextRenderer(shaderProgram),
    createCharacterRenderer(shaderProgram),
  ])
  new BackgroundRenderer(shaderProgram).renderBackground(`#6969`)
  textRenderer.renderLine(`Kira is the best`, new Vec2(8, 112))
  textRenderer.renderLine(`Stardust is pretty`, new Vec2(8, 128))
  characterRenderer.renderCharacter(`PLAYER_MALE`, {
    position: new Vec2(24, 24),
    color: SpriteColors.RED,
    facing: Facing.FRONT,
    // isWalking: true,
  })
  // const game = new Game(shaderProgram)
  // game.runLoop()
}
main()
