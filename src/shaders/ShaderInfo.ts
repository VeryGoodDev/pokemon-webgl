export default class ShaderInfo {
  #program: WebGLProgram
  #webgl: WebGLRenderingContext
  #aCache: Map<string, number>
  #uCache: Map<string, WebGLUniformLocation>

  constructor(program: WebGLProgram, webgl: WebGLRenderingContext) {
    this.#program = program
    this.#webgl = webgl
    this.#aCache = new Map()
    this.#uCache = new Map()
  }

  get program(): WebGLProgram {
    return this.#program
  }

  // ENHANCEMENT Look into perf, cache lookups if helpful
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
}
