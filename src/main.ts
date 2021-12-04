import { getRectangleBufferData } from './geometry/util'
import { createShaderProgram } from './shaders/ShaderProgram'
import { loadFile, loadImage } from './util'
import { clearCanvas } from './webgl-util'

// async function mainOLD() {
//   const canvas: HTMLCanvasElement = document.querySelector(`.screen`)
//   const webgl = canvas.getContext(`webgl`)
//   if (webgl === null) {
//     console.error(`WebGL is not supported by your browser or device`)
//   }
//   webgl.clearColor(0, 0, 0, 1)
//   webgl.clear(webgl.COLOR_BUFFER_BIT)

//   const [vertexShaderSource, fragmentShaderSource, texture] = await Promise.all([
//     loadFile(`src/assets/shaders/vertex.glsl`),
//     loadFile(`src/assets/shaders/fragment.glsl`),
//     loadTexture(webgl, `src/assets/img/1-50-normal.png`),
//   ])
//   const shaderProgram = createShaderProgram(webgl, vertexShaderSource, fragmentShaderSource)
//   const shaderInfo = new ShaderInfo(shaderProgram, webgl)
//   const buffers = createBuffers(webgl)
//   drawScene(webgl, shaderInfo, buffers, texture)
// }

async function main() {
  const canvas: HTMLCanvasElement = document.querySelector(`.screen`)
  const webgl = canvas.getContext(`webgl2`)
  // FIXME Show error on-screen somewhere
  if (webgl === null) {
    console.error(`WebGL is not supported by your browser or device`)
  }

  const [vertexShaderSource, fragmentShaderSource, image] = await Promise.all([
    loadFile(`src/assets/shaders/vertex.glsl`),
    loadFile(`src/assets/shaders/fragment.glsl`),
    loadImage(`src/assets/img/sprites/font.png`),
  ])

  const shaderProgram = createShaderProgram(webgl, vertexShaderSource, fragmentShaderSource)

  // NOTE: ALL THIS POSITION SHIT HAS TO COME BEFORE THE TEXTURE SHIT OR IT WON'T RENDER THE IMAGE
  const vertexArrayObj = webgl.createVertexArray()
  webgl.bindVertexArray(vertexArrayObj)
  const positionBuffer = webgl.createBuffer()
  shaderProgram.bufferData(positionBuffer)
  shaderProgram.sendBufferToAttribute(`aPosition`, { componentsPerIteration: 2 })

  shaderProgram.bufferData(
    webgl.createBuffer(),
    new Float32Array([0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0])
  )
  shaderProgram.sendBufferToAttribute(`aTexCoord`, { componentsPerIteration: 2 })

  const texture = webgl.createTexture()
  // Makes TEXTURE0 the unit all other texture commands apply to
  webgl.activeTexture(webgl.TEXTURE0)
  webgl.bindTexture(webgl.TEXTURE_2D, texture)

  // These next 4 lines turn off mips, turn off filtering, and prevent repeating
  webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_S, webgl.CLAMP_TO_EDGE)
  webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_T, webgl.CLAMP_TO_EDGE)
  webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MIN_FILTER, webgl.NEAREST)
  webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MAG_FILTER, webgl.NEAREST)

  // This uploads the image into the texture
  webgl.texImage2D(
    webgl.TEXTURE_2D,
    0, // level (largest mip)
    webgl.RGBA, // internalFormat (format for the texture to use)
    webgl.RGBA, // srcFormat (format of the data being supplied)
    webgl.UNSIGNED_BYTE, // srcType (the type of data we're supplying from the texture buffer
    image
  )

  // Tells WebGL how to convert its internal space to pixel-oriented space,
  // so it goes from (0,0) to (canvas.width, canvas.height) instead of its
  // default, less-intuitive -1 to 1 based system
  webgl.viewport(0, 0, webgl.canvas.width, webgl.canvas.height)

  clearCanvas(webgl)

  shaderProgram.use()
  webgl.uniform2f(shaderProgram.getUniformLocation(`uResolution`), webgl.canvas.width, webgl.canvas.height)

  // Tells the shader to get the texture from TEXTURE0
  webgl.uniform1i(shaderProgram.getUniformLocation(`uImage`), 0)

  // Bind the position buffer to ARRAY_BUFFER so drawRectangle puts data in the correct place
  shaderProgram.bufferData(positionBuffer, getRectangleBufferData(1, 0.5, image.width, image.height))
  webgl.drawArrays(webgl.TRIANGLES, 0, 6)

  // Draw a rectangle the same size as the image
  // drawRectangle(webgl, 1, 0.5, image.width, image.height)

  // for (let i = 0; i < 100; ++i) {
  //   drawRectangle(
  //     webgl,
  //     randomFromRange(1, 159),
  //     randomFromRange(1, 143),
  //     randomFromRange(1, 25),
  //     randomFromRange(1, 25),
  //     shaderProgram.getUniformLocation(`uColor`)
  //   )
  // }
}
main()
