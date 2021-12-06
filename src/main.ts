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
  textRenderer.renderText(`VERYGOODDEV`)
  // shaderProgram.addImageToRenderQueue(image, new Vec2(2, 2), {
  //   offset: new Vec2(8, 8),
  //   size: new Size(16, 16),
  // })
  // shaderProgram.addImageToRenderQueue(image, new Vec2(17, 8), {
  //   offset: new Vec2(16, 24),
  //   size: new Size(8, 8),
  // })
  // shaderProgram.renderImagesFromQueue()
  // const game = new Game(shaderProgram)
  // game.runLoop()
}
main()
