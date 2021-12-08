import Game from './engine/Game'
import { createCharacterRenderer } from './render/CharacterRenderer'
import { createShaderProgram } from './render/ShaderProgram'
import { Facing, SpriteColors } from './render/spriteInfo/overworld-characters'
import { createTextRenderer } from './render/TextRenderer'
import Texture from './textures'
import { loadFile, loadImage, Vec2 } from './util'

async function main() {
  const canvas: HTMLCanvasElement = document.querySelector(`.screen`)
  const webgl = canvas.getContext(`webgl2`)
  // FIXME Show error on-screen somewhere
  if (webgl === null) {
    console.error(`WebGL is not supported by your browser or device`)
    return
  }

  const [vertexShaderSource, fragmentShaderSource, image] = await Promise.all([
    loadFile(`src/assets/shaders/vertex.glsl`),
    loadFile(`src/assets/shaders/fragment.glsl`),
    loadImage(`src/assets/img/sprites/font.png`),
  ])

  // The main program this game engine will use all over the place
  const shaderProgram = createShaderProgram(webgl, vertexShaderSource, fragmentShaderSource)
  shaderProgram.use()
  shaderProgram.setResolutionThroughUniform(`uResolution`)
  shaderProgram.specifyTextureThroughUniform(`uImage`, 0)
  // const texture = new Texture(shaderProgram)
  // texture.init(webgl.TEXTURE0, webgl.TEXTURE_2D, image)
  const [textRenderer, characterRenderer] = await Promise.all([
    createTextRenderer(shaderProgram),
    createCharacterRenderer(shaderProgram),
  ])
  textRenderer.renderLine(`Kira is the best`, new Vec2(8, 112))
  textRenderer.renderLine(`Stardust is pretty`, new Vec2(8, 128))
  characterRenderer.renderCharacter(`PLAYER_MALE`, {
    position: new Vec2(24, 24),
    color: SpriteColors.RED,
    facing: Facing.FRONT,
    // isWalking: true,
  })
  // shaderProgram.addImageToRenderQueue
  // const game = new Game(shaderProgram)
  // game.runLoop()
}
main()
