import ShaderInfo from './shaders/ShaderInfo'
import { createPositionBuffer, createShaderProgram, drawScene } from './shaders/util'

const canvas: HTMLCanvasElement = document.querySelector(`.screen`)
const webgl = canvas.getContext(`webgl`)
if (webgl === null) {
  console.error(`WebGL is not supported by your browser or device`)
}
webgl.clearColor(0, 0, 0, 1)
webgl.clear(webgl.COLOR_BUFFER_BIT)

const vertexShaderSource = `
  attribute vec4 aVertexPosition;

  uniform mat4 uModelViewMatrix;
  uniform mat4 uProjectionMatrix;

  void main() {
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
  }
`
const fragmentShaderSource = `
  void main() {
    gl_FragColor = vec4(0.5, 0, 0.75, 1.0);
  }
`

const shaderProgram = createShaderProgram(webgl, vertexShaderSource, fragmentShaderSource)
const shaderInfo = new ShaderInfo(shaderProgram, webgl)
const positionBuffer = createPositionBuffer(webgl)
drawScene(webgl, shaderInfo, positionBuffer)
