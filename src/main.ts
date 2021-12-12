import { createGame } from './Game'
import { createShaderProgram } from './render/ShaderProgram'
import { loadFile } from './util'

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
  const game = await createGame(shaderProgram)
  game.draw()
  // game.runLoop()
}
main()
