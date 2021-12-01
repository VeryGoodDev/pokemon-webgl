export default class ShaderInfo {
  #program: WebGLProgram
  #webgl: WebGLRenderingContext

  constructor(program: WebGLProgram, webgl: WebGLRenderingContext) {
    this.#program = program
    this.#webgl = webgl
  }

  get program(): WebGLProgram {
    return this.#program
  }

  // ENHANCEMENT Look into perf, cache lookups if helpful
  getAttributeLocation(name: string): number {
    return this.#webgl.getAttribLocation(this.#program, name)
  }

  getUniformLocation(name: string): WebGLUniformLocation {
    return this.#webgl.getUniformLocation(this.#program, name)
  }
}
