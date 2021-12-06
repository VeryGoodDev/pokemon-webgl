import Game from './engine/Game'
import { createShaderProgram } from './render/ShaderProgram'
import { createTextRenderer } from './render/TextRenderer'
import Texture from './textures'
import { loadFile, loadImage, Size, Vec2 } from './util'

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
  const texture = new Texture(shaderProgram)
  texture.init(webgl.TEXTURE0, webgl.TEXTURE_2D, image)
  const textRenderer = await createTextRenderer(shaderProgram)
  textRenderer.renderLine(`Are you a boy?`, new Vec2(8, 112))
  textRenderer.renderLine(`Or are you a girl?`, new Vec2(8, 128))
  // const game = new Game(shaderProgram)
  // game.runLoop()
}
main()
