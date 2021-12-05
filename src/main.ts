import { createShaderProgram } from './shaders/ShaderProgram'
import { loadFile, loadImage } from './util'

async function main() {
  const canvas: HTMLCanvasElement = document.querySelector(`.screen`)
  const webgl = canvas.getContext(`webgl2`, { alpha: true })
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
  shaderProgram.resetCanvas()
  const loop = () => {
    shaderProgram.renderImage(image, 4, 4, {
      offset: { x: 40, y: 72 },
      size: { width: 8, height: 8 },
    })
    requestAnimationFrame(loop)
  }
  loop()
}
main()
