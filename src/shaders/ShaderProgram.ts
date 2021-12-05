import * as webglUtils from '../webgl-util'

export default class ShaderProgram {
  #program: WebGLProgram
  #webgl: WebGL2RenderingContext
  #aCache: Map<string, number>
  #uCache: Map<string, WebGLUniformLocation>

  constructor(program: WebGLProgram, webgl: WebGL2RenderingContext) {
    this.#program = program
    this.#webgl = webgl
    this.#aCache = new Map()
    this.#uCache = new Map()
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
  sendBufferToAttribute(attributeName: string, options: webglUtils.SendBufferToAttributeOptions): void {
    webglUtils.sendBufferToAttribute(this.#webgl, this.getAttributeLocation(attributeName), options)
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
