import { drawRectangle } from './geometry/util'
import { randomFromRange } from './math/util'
import ShaderInfo from './shaders/ShaderInfo'
import { loadTexture } from './shaders/textures'
import { createBuffers, createShaderProgram, drawScene } from './shaders/util'
import { loadFile } from './util'

async function mainOLD() {
  const canvas: HTMLCanvasElement = document.querySelector(`.screen`)
  const webgl = canvas.getContext(`webgl`)
  if (webgl === null) {
    console.error(`WebGL is not supported by your browser or device`)
  }
  webgl.clearColor(0, 0, 0, 1)
  webgl.clear(webgl.COLOR_BUFFER_BIT)

  const [vertexShaderSource, fragmentShaderSource, texture] = await Promise.all([
    loadFile(`src/assets/shaders/vertex.glsl`),
    loadFile(`src/assets/shaders/fragment.glsl`),
    loadTexture(webgl, `src/assets/img/1-50-normal.png`),
  ])
  const shaderProgram = createShaderProgram(webgl, vertexShaderSource, fragmentShaderSource)
  const shaderInfo = new ShaderInfo(shaderProgram, webgl)
  const buffers = createBuffers(webgl)
  drawScene(webgl, shaderInfo, buffers, texture)
}

async function main() {
  const canvas: HTMLCanvasElement = document.querySelector(`.screen`)
  const webgl = canvas.getContext(`webgl2`)
  // FIXME Show error on-screen somewhere
  if (webgl === null) {
    console.error(`WebGL is not supported by your browser or device`)
  }

  const [vertexShaderSource, fragmentShaderSource] = await Promise.all([
    loadFile(`src/assets/shaders/vertex.glsl`),
    loadFile(`src/assets/shaders/fragment.glsl`),
  ])

  const shaderProgram = createShaderProgram(webgl, vertexShaderSource, fragmentShaderSource)
  const shaderInfo = new ShaderInfo(shaderProgram, webgl)

  const positionBuffer = webgl.createBuffer()
  webgl.bindBuffer(webgl.ARRAY_BUFFER, positionBuffer)
  const positions = [10, 100, 159, 100, 10, 11, 10, 11, 159, 100, 159, 11]
  webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(positions), webgl.STATIC_DRAW)

  const vertexArrayObj = webgl.createVertexArray()
  webgl.bindVertexArray(vertexArrayObj)
  webgl.enableVertexAttribArray(shaderInfo.getAttributeLocation(`aPosition`))
  // This function also binds ARRAY_BUFFER to the attribute passed in the first arg
  // It keeps using the position buffer we set, but we can re-bind ARRAY_BUFFER now
  webgl.vertexAttribPointer(
    shaderInfo.getAttributeLocation(`aPosition`), // index
    2, // size
    webgl.FLOAT, // type
    false, // normalize
    0, // stride
    0 // offset
  )

  // Tells WebGL how to convert its internal space to pixel-oriented space,
  // so it goes from (0,0) to (canvas.width, canvas.height) instead of its
  // default, less-intuitive -1 to 1 based system
  webgl.viewport(0, 0, webgl.canvas.width, webgl.canvas.height)

  webgl.clearColor(0, 0, 0, 0)
  webgl.clear(webgl.COLOR_BUFFER_BIT)

  webgl.useProgram(shaderInfo.program)
  webgl.uniform2f(shaderInfo.getUniformLocation(`uResolution`), webgl.canvas.width, webgl.canvas.height)

  for (let i = 0; i < 50; ++i) {
    drawRectangle(
      webgl,
      randomFromRange(1, 159),
      randomFromRange(1, 143),
      randomFromRange(1, 25),
      randomFromRange(1, 25),
      shaderInfo.getUniformLocation(`uColor`)
    )
  }
}
main()
