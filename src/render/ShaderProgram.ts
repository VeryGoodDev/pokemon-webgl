import { getRectangleBufferData } from '../geometry/util'
import Texture from '../textures'
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

export default class ShaderProgram {
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

  addImageToRenderQueue(image: TexImageSource, position: Vec2, spriteOptions: SpriteOptions = {}): void {
    const imageSize = new Size(image.width, image.height)
    const positionBuffer = getRectangleBufferData(position, spriteOptions.size ?? imageSize)
    const textureCoordsBuffer = getTexturePositionCoords(spriteOptions, imageSize)
    this.#queuedBuffers.push({ position: positionBuffer, textureCoords: textureCoordsBuffer })
  }
  bufferData(bufferToBind: WebGLBuffer, dataToBuffer: BufferSource = null, options = {}): void {
    webglUtils.bufferData(this.#webgl, bufferToBind, dataToBuffer, options)
  }
  clearCanvas() {
    webglUtils.clearCanvas(this.#webgl)
  }
  drawTrianglesFromBuffer() {
    this.#webgl.drawArrays(this.#webgl.TRIANGLES, FIRST_DRAW_INDEX, NUM_INDICES_TO_DRAW * this.#queuedBuffers.length)
    this.#queuedBuffers = []
  }
  prepareImageForRender(image: TexImageSource, position: Vec2, spriteOptions: SpriteOptions = {}): void {
    const imageSize = new Size(image.width, image.height)
    // Set up position buffer and give it the image data to calculate the rectangle to draw
    this.bufferData(
      this.#webgl.createBuffer(),
      new Float32Array(getRectangleBufferData(position, spriteOptions?.size ?? imageSize))
    )
    this.sendBufferToAttribute(`aPosition`)

    // Set up and send data to the texture coord attribute
    // TODO: A SpriteSheet class (also to use for font/text renderer) that does like this and calculates precise arrays of positions, but caches those results (either as a pre-rendered <canvas> buffer, or just the positions)
    this.bufferData(this.#webgl.createBuffer(), new Float32Array(getTexturePositionCoords(spriteOptions, imageSize)))
    // this.bufferData(this.#webgl.createBuffer(), new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]))
    this.sendBufferToAttribute(`aTexCoord`)

    // Set up our texture
    const texture = new Texture(this)
    texture.init(this.#webgl.TEXTURE0, this.#webgl.TEXTURE_2D, image)
  }
  renderImage(image: TexImageSource, position: Vec2, spriteOptions: SpriteOptions = {}): void {
    this.prepareImageForRender(image, position, spriteOptions)
    this.drawTrianglesFromBuffer()
  }
  renderImagesFromQueue() {
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
  }
  resetCanvas() {
    this.clearCanvas()
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
