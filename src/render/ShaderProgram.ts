import { getRectangleBufferData } from '../geometry/util'
import { Size, Vec2 } from '../util'
import * as webglUtils from '../webgl-util'

interface SpriteOptions {
  offset?: Vec2
  size?: Size
}
interface QueuedBuffer {
  position: number[]
  textureCoords: number[]
}

const FIRST_DRAW_INDEX = 0
const NUM_INDICES_TO_DRAW = 6

function getDefaultSize(webgl: WebGL2RenderingContext): Size {
  return {
    width: webgl.canvas.width,
    height: webgl.canvas.height,
  }
}
function getTexturePositionCoords(spriteOptions: SpriteOptions, imageSize: Size): number[] {
  // NOTE: All four values that
  let xStart = 0
  let yStart = 0
  if (spriteOptions?.offset) {
    xStart = spriteOptions.offset.x / imageSize.width
    yStart = spriteOptions.offset.y / imageSize.height
  }
  let { width, height } = imageSize
  if (spriteOptions?.size) {
    width = spriteOptions.size.width / imageSize.width
    height = spriteOptions.size.height / imageSize.height
  }
  const offset = new Vec2(xStart, yStart)
  const size = new Size(width, height)
  return getRectangleBufferData(offset, size)
}

class ShaderProgram {
  #program: WebGLProgram
  #webgl: WebGL2RenderingContext
  #aCache: Map<string, number>
  #uCache: Map<string, WebGLUniformLocation>
  #vertexArrayObj: WebGLVertexArrayObject
  #queuedBuffers: QueuedBuffer[]

  constructor(program: WebGLProgram, webgl: WebGL2RenderingContext) {
    this.#program = program
    this.#webgl = webgl
    this.#aCache = new Map()
    this.#uCache = new Map()
    this.#queuedBuffers = []

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

  cloneWithNewContext(webgl: WebGL2RenderingContext): ShaderProgram {
    return new ShaderProgram(this.#program, webgl)
  }

  addColorToRenderQueue(
    position: Vec2,
    size: Size = new Size(this.#webgl.canvas.width, this.#webgl.canvas.height)
  ): void {
    // When rendering a solid color, the position and texture will always be identical in size and location
    const buffer = getRectangleBufferData(position, size)
    this.#queuedBuffers.push({ position: buffer, textureCoords: buffer })
  }
  addImageToRenderQueue(image: TexImageSource, position: Vec2, spriteOptions: SpriteOptions = {}): void {
    const imageSize = new Size(image.width, image.height)
    const positionBuffer = getRectangleBufferData(position, spriteOptions.size ?? imageSize)
    const textureCoordsBuffer = getTexturePositionCoords(spriteOptions, imageSize)
    this.#queuedBuffers.push({ position: positionBuffer, textureCoords: textureCoordsBuffer })
  }
  bufferData(bufferToBind: WebGLBuffer, dataToBuffer: BufferSource = null, options = {}): void {
    webglUtils.bufferData(this.#webgl, bufferToBind, dataToBuffer, options)
  }
  clearCanvas(color = `#fff`) {
    webglUtils.clearCanvas(this.#webgl, color)
  }
  drawTrianglesFromBuffer() {
    if (this.#queuedBuffers.length < 1) {
      console.warn(
        `[ShaderProgram::drawTrianglesFromBuffer()] drawTrianglesFromBuffer was called, but the queue of buffers maintained by the ShaderProgram is empty. Depending on where the call to here came from, there may be no issue, but if anything isn't working as expected, consider trying to buffer any image(s) through the addImageToRenderQueue method and then call the renderImagesFromQueue method instead of calling drawTrianglesFromBuffer directly`
      )
    }
    this.#webgl.drawArrays(this.#webgl.TRIANGLES, FIRST_DRAW_INDEX, NUM_INDICES_TO_DRAW * this.#queuedBuffers.length)
  }
  renderFromQueue() {
    const { positionArray, textureCoordArray } = this.#queuedBuffers.reduce(
      (combinedBuffers, nextInQueue) => {
        combinedBuffers.positionArray = combinedBuffers.positionArray.concat(nextInQueue.position)
        combinedBuffers.textureCoordArray = combinedBuffers.textureCoordArray.concat(nextInQueue.textureCoords)
        return combinedBuffers
      },
      { positionArray: [], textureCoordArray: [] }
    )
    this.bufferData(this.#webgl.createBuffer(), new Float32Array(positionArray))
    this.sendBufferToAttribute(`aPosition`)
    this.bufferData(this.#webgl.createBuffer(), new Float32Array(textureCoordArray))
    this.sendBufferToAttribute(`aTexCoord`)
    this.drawTrianglesFromBuffer()
    this.#queuedBuffers = []
  }
  resetCanvas(color = `#fff`) {
    this.clearCanvas(color)
    this.setViewportToCanvas()
  }
  sendBufferToAttribute(attributeName: string, options: webglUtils.SendBufferToAttributeOptions = {}): void {
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
    console.error(`[loadShader()] There was an error while compiling the shader: ${webgl.getShaderInfoLog(shader)}`)
    webgl.deleteShader(shader)
    return null
  }
  return shader
}
function createShaderProgram(
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
      `[createShaderProgram()] Unable to initialize the shader program: ${webgl.getProgramInfoLog(shaderProgram)}`
    )
    return null
  }
  return new ShaderProgram(shaderProgram, webgl)
}

export default ShaderProgram
export { createShaderProgram }
