import Game from './engine/Game'
import { createShaderProgram } from './render/ShaderProgram'
import Spritesheet from './Spritesheet'
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
  const fontSprites = new Spritesheet(image, new Size(8, 8))
  fontSprites.defineSprite(`A`, new Vec2(0, 0))
  fontSprites.defineSprite(`B`, new Vec2(8, 0))
  fontSprites.defineSprite(`C`, new Vec2(16, 0))
  const infoA = fontSprites.getSpriteData(`A`)
  const infoB = fontSprites.getSpriteData(`B`)
  const infoC = fontSprites.getSpriteData(`C`)
  const texture = new Texture(shaderProgram)
  texture.init(webgl.TEXTURE0, webgl.TEXTURE_2D, image)
  shaderProgram.addImageToRenderQueue(image, new Vec2(2, 2), {
    offset: infoA.offset,
    size: infoB.size,
  })
  shaderProgram.addImageToRenderQueue(image, new Vec2(10, 2), {
    offset: infoB.offset,
    size: infoB.size,
  })
  shaderProgram.addImageToRenderQueue(image, new Vec2(18, 2), {
    offset: infoC.offset,
    size: infoC.size,
  })
  shaderProgram.renderImagesFromQueue()
  // const game = new Game(shaderProgram)
  // game.runLoop()
}
main()
