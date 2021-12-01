import ShaderInfo from './shaders/ShaderInfo'
import { createBuffers, createShaderProgram, drawScene } from './shaders/util'

const canvas: HTMLCanvasElement = document.querySelector(`.screen`)
const webgl = canvas.getContext(`webgl`)
if (webgl === null) {
  console.error(`WebGL is not supported by your browser or device`)
}
webgl.clearColor(0, 0, 0, 1)
webgl.clear(webgl.COLOR_BUFFER_BIT)

const vertexShaderSource = `
  attribute vec4 aVertexPosition;
  attribute vec4 aVertexColor;

  uniform mat4 uModelViewMatrix;
  uniform mat4 uProjectionMatrix;

  varying lowp vec4 vColor;

  void main(void) {
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    vColor = aVertexColor;
  }
`
const fragmentShaderSource = `
  varying lowp vec4 vColor;

  void main(void) {
    gl_FragColor = vColor;
  }
`

const shaderProgram = createShaderProgram(webgl, vertexShaderSource, fragmentShaderSource)
const shaderInfo = new ShaderInfo(shaderProgram, webgl)
const buffers = createBuffers(webgl)
drawScene(webgl, shaderInfo, buffers)
