/* eslint-disable no-bitwise */
import { mat4, vec3 } from 'gl-matrix'
import { degToRad } from '../math/util'
import ShaderInfo from './ShaderInfo'
import type { Buffers } from './types'

function loadShader(webgl: WebGLRenderingContext, type: number, source: string): WebGLShader {
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
  webgl: WebGLRenderingContext,
  vertexShaderSource: string,
  fragmentShaderSource: string
): WebGLProgram {
  const vertexShader = loadShader(webgl, webgl.VERTEX_SHADER, vertexShaderSource)
  const fragmentShader = loadShader(webgl, webgl.FRAGMENT_SHADER, fragmentShaderSource)
  const shaderProgram = webgl.createProgram()
  webgl.attachShader(shaderProgram, vertexShader)
  webgl.attachShader(shaderProgram, fragmentShader)
  webgl.linkProgram(shaderProgram)
  if (!webgl.getProgramParameter(shaderProgram, webgl.LINK_STATUS)) {
    console.error(`Unable to initialize the shader program: ${webgl.getProgramInfoLog(shaderProgram)}`)
    return null
  }
  return shaderProgram
}
export function createBuffers(webgl: WebGLRenderingContext): Buffers {
  const positionBuffer = webgl.createBuffer()
  webgl.bindBuffer(webgl.ARRAY_BUFFER, positionBuffer)
  const positions = [-1, 1, 1, 1, -1, -1, 1, -1]
  webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(positions), webgl.STATIC_DRAW)

  const colorBuffer = webgl.createBuffer()
  webgl.bindBuffer(webgl.ARRAY_BUFFER, colorBuffer)
  /* eslint-disable prettier/prettier */
  const colors = [
    1, 1, 1, 1, // white
    1, 0, 0, 1, // red
    0, 1, 0, 1, // green
    0, 0, 1, 1, // blue
  ]
  /* eslint-enable prettier/prettier */
  webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(colors), webgl.STATIC_DRAW)
  return {
    position: positionBuffer,
    color: colorBuffer,
  }
}
export function drawScene(webgl: WebGLRenderingContext, shaderInfo: ShaderInfo, buffers: Buffers): void {
  webgl.clearColor(0, 0, 0, 1)
  webgl.clearDepth(1)
  webgl.enable(webgl.DEPTH_TEST)
  webgl.depthFunc(webgl.LEQUAL)

  webgl.clear(webgl.COLOR_BUFFER_BIT | webgl.DEPTH_BUFFER_BIT)

  const fieldOfView = degToRad(45)
  const aspectRatio = webgl.canvas.clientWidth / webgl.canvas.clientHeight
  const zNear = 0.1
  const zFar = 100

  const projectionMatrix = mat4.create()
  mat4.perspective(projectionMatrix, fieldOfView, aspectRatio, zNear, zFar)

  const modelViewMatrix = mat4.create()
  const modelViewTranslation = vec3.fromValues(-0, 0, -8)
  mat4.translate(modelViewMatrix, modelViewMatrix, modelViewTranslation)

  webgl.bindBuffer(webgl.ARRAY_BUFFER, buffers.position)
  webgl.vertexAttribPointer(
    shaderInfo.getAttributeLocation(`aVertexPosition`),
    2, // numComponents
    webgl.FLOAT, // bufferDataType
    false, // shouldNormalize
    0, // stride
    0 // positionBufferOffset
  )
  webgl.enableVertexAttribArray(shaderInfo.getAttributeLocation(`aVertexPosition`))

  webgl.bindBuffer(webgl.ARRAY_BUFFER, buffers.color)
  webgl.vertexAttribPointer(
    shaderInfo.getAttributeLocation(`aVertexColor`),
    4, // numComponents
    webgl.FLOAT, // bufferDataType
    false, // shouldNormalize
    0, // stride
    0 // positionBufferOffset
  )
  webgl.enableVertexAttribArray(shaderInfo.getAttributeLocation(`aVertexColor`))

  webgl.useProgram(shaderInfo.program)
  webgl.uniformMatrix4fv(shaderInfo.getUniformLocation(`uProjectionMatrix`), false, projectionMatrix)
  webgl.uniformMatrix4fv(shaderInfo.getUniformLocation(`uModelViewMatrix`), false, modelViewMatrix)

  const offset = 0
  const vertexCount = 4
  webgl.drawArrays(webgl.TRIANGLE_STRIP, offset, vertexCount)
}
