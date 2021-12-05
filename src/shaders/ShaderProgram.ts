import { getRectangleBufferData } from '../geometry/util'
import Texture from '../textures'
import * as webglUtils from '../webgl-util'

interface Size {
  width: number
  height: number
}
interface SpriteOptions {
  offset?: {
    x: number
    y: number
  }
  size?: {
    width: number
    height: number
  }
}

const FIRST_DRAW_INDEX = 0
const NUM_INDICES_TO_DRAW = 6

function getDefaultSize(webgl: WebGL2RenderingContext): Size {
  return {
    width: webgl.canvas.width,
    height: webgl.canvas.height,
  }
}
function getTexturePositionCoords(spriteOptions: SpriteOptions, imageWidth: number, imageHeight: number): Float32Array {
  let xStart = 0
  if (spriteOptions?.offset) {
    xStart = spriteOptions.offset.x
  }
  let xEnd = 1
  if (spriteOptions?.size) {
    xEnd = (xStart + spriteOptions.size.width) / imageWidth
  }
  xStart /= imageWidth
  let yStart = 0
  if (spriteOptions?.offset) {
    yStart = spriteOptions.offset.y
  }
  let yEnd = 1
  if (spriteOptions?.size) {
    yEnd = (yStart + spriteOptions.size.height) / imageHeight
  }
  yStart /= imageHeight
  return new Float32Array([xStart, yStart, xEnd, yStart, xStart, yEnd, xStart, yEnd, xEnd, yStart, xEnd, yEnd])
}

export default class ShaderProgram {
  #program: WebGLProgram
  #webgl: WebGL2RenderingContext
  #aCache: Map<string, number>
  #uCache: Map<string, WebGLUniformLocation>
  #vertexArrayObj: WebGLVertexArrayObject

  constructor(program: WebGLProgram, webgl: WebGL2RenderingContext) {
    this.#program = program
    this.#webgl = webgl
    this.#aCache = new Map()
    this.#uCache = new Map()

    // I think this like "records" stuff using the vertex shader or something idk
    // Mostly just doing it so it's available if I end up needing it later
    this.#vertexArrayObj = this.#webgl.createVertexArray()
    this.#webgl.bindVertexArray(this.#vertexArrayObj)
  }

  get webgl() {
    return this.#webgl
  }

  getAttributeLocation(name: string): number {
    let location = this.#aCache.get(name)
    if (location === undefined) {
      location = this.#webgl.getAttribLocation(this.#program, name)
      this.#aCache.set(name, location)
    }
    return location
  }
  getUniformLocation(name: string): WebGLUniformLocation {
    let location = this.#uCache.get(name)
    if (location === undefined) {
      location = this.#webgl.getUniformLocation(this.#program, name)
      this.#uCache.set(name, location)
    }
    return location
  }

  bufferData(bufferToBind: WebGLBuffer, dataToBuffer: BufferSource = null, options = {}): void {
    webglUtils.bufferData(this.#webgl, bufferToBind, dataToBuffer, options)
  }
  clearCanvas() {
    webglUtils.clearCanvas(this.#webgl)
  }
  drawRectangle(x: number, y: number, width: number, height: number, color = new Uint8Array([255, 255, 255, 1])): void {
    // Set up position buffer and give it the image data to calculate the rectangle to draw
    this.bufferData(this.#webgl.createBuffer(), getRectangleBufferData(x, y, width, height))
    this.sendBufferToAttribute(`aPosition`, { componentsPerIteration: 2 })

    // Set up and send data to the texture coord attribute
    this.bufferData(this.#webgl.createBuffer(), new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]))
    this.sendBufferToAttribute(`aTexCoord`, { componentsPerIteration: 2 })

    // Set up a 1x1 pixel in the specified color to draw
    const texture = new Texture(this)
    texture.init(this.#webgl.TEXTURE0, this.#webgl.TEXTURE_2D, color)

    this.drawTrianglesFromBuffer()
  }
  renderImage(image: TexImageSource, x: number, y: number, spriteOptions: SpriteOptions = {}): void {
    // Set up position buffer and give it the image data to calculate the rectangle to draw
    this.bufferData(
      this.#webgl.createBuffer(),
      getRectangleBufferData(
        x,
        y,
        spriteOptions?.size?.width ?? image.width,
        spriteOptions?.size?.height ?? image.height
      )
    )
    this.sendBufferToAttribute(`aPosition`, { componentsPerIteration: 2 })

    // Set up and send data to the texture coord attribute
    const texturePositionCoords = getTexturePositionCoords(spriteOptions, image.width, image.height)
    this.bufferData(this.#webgl.createBuffer(), texturePositionCoords)
    // this.bufferData(this.#webgl.createBuffer(), new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]))
    this.sendBufferToAttribute(`aTexCoord`, { componentsPerIteration: 2 })

    // Set up our texture
    const texture = new Texture(this)
    texture.init(this.#webgl.TEXTURE0, this.#webgl.TEXTURE_2D, image)

    // All the data is buffered, this gets the GPU to actually draw it all out
    this.drawTrianglesFromBuffer()
  }
  drawTrianglesFromBuffer() {
    this.#webgl.drawArrays(this.#webgl.TRIANGLES, FIRST_DRAW_INDEX, NUM_INDICES_TO_DRAW)
  }
  resetCanvas() {
    this.clearCanvas()
    this.setViewportToCanvas()
  }
  sendBufferToAttribute(attributeName: string, options: webglUtils.SendBufferToAttributeOptions): void {
    webglUtils.sendBufferToAttribute(this.#webgl, this.getAttributeLocation(attributeName), options)
  }
  setResolutionThroughUniform(resolutionUniformName: string, size = getDefaultSize(this.#webgl)): void {
    this.#webgl.uniform2f(this.getUniformLocation(resolutionUniformName), size.width, size.height)
  }
  setViewportToCanvas(): void {
    this.#webgl.viewport(0, 0, this.#webgl.canvas.width, this.#webgl.canvas.height)
  }
  specifyTextureThroughUniform(textureUniformName: string, textureIndex: number): void {
    this.#webgl.uniform1i(this.getUniformLocation(textureUniformName), textureIndex)
  }
  use() {
    this.#webgl.useProgram(this.#program)
  }
}
function loadShader(webgl: WebGL2RenderingContext, type: number, source: string): WebGLShader {
  const shader = webgl.createShader(type)
  webgl.shaderSource(shader, source)
  webgl.compileShader(shader)
  if (!webgl.getShaderParameter(shader, webgl.COMPILE_STATUS)) {
    console.error(`[shaders/util.ts] There was an error while compiling the shader: ${webgl.getShaderInfoLog(shader)}`)
    webgl.deleteShader(shader)
    return null
  }
  return shader
}
export function createShaderProgram(
  webgl: WebGL2RenderingContext,
  vertexShaderSource: string,
  fragmentShaderSource: string
): ShaderProgram {
  const vertexShader = loadShader(webgl, webgl.VERTEX_SHADER, vertexShaderSource)
  const fragmentShader = loadShader(webgl, webgl.FRAGMENT_SHADER, fragmentShaderSource)
  if (!vertexShader || !fragmentShader) {
    return null
  }
  const shaderProgram = webgl.createProgram()
  webgl.attachShader(shaderProgram, vertexShader)
  webgl.attachShader(shaderProgram, fragmentShader)
  webgl.linkProgram(shaderProgram)
  if (!webgl.getProgramParameter(shaderProgram, webgl.LINK_STATUS)) {
    console.error(
      `[shaders/util.ts] Unable to initialize the shader program: ${webgl.getProgramInfoLog(shaderProgram)}`
    )
    return null
  }
  return new ShaderProgram(shaderProgram, webgl)
}
