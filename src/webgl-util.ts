// Types
export interface SendBufferToAttributeOptions {
  componentsPerIteration: number
  sentDataType?:
    | WebGL2RenderingContext[`FLOAT`]
    | WebGL2RenderingContext[`SHORT`]
    | WebGL2RenderingContext[`BYTE`]
    | WebGL2RenderingContext[`UNSIGNED_SHORT`]
    | WebGL2RenderingContext[`UNSIGNED_BYTE`]
    | WebGL2RenderingContext[`HALF_FLOAT`]
  shouldNormalizeData?: boolean
  offsetBetweenIterations?: number
  offsetOfStart?: number
}

// Constants
const DEFAULT_BUFFER_OPTIONS = {
  bufferToBindTo: WebGL2RenderingContext.ARRAY_BUFFER,
  bufferDataUsageHint: WebGL2RenderingContext.STATIC_DRAW,
}
const DEFAULT_UPLOAD_OPTIONS = {
  /** 0 (default) is base image level, any other number n is the nth mipmap reduction level */
  detailLevel: 0,
  /** What color format is in the texture */
  internalFormat: WebGL2RenderingContext.RGBA,
  /** Specifies the border width, but always has to be 0 for some reason idk */
  border: 0,
  /** Format of the data being supplied through the texture */
  srcFormat: WebGL2RenderingContext.RGBA,
  /** Data type of the data being supplied through the texture */
  srcType: WebGL2RenderingContext.UNSIGNED_BYTE,
}

// Lower level WebGL shit
export function bufferData(
  webgl: WebGL2RenderingContext,
  bufferToBind: WebGLBuffer,
  dataToBuffer: BufferSource = null,
  incomingOptions = {}
): void {
  const options: typeof DEFAULT_BUFFER_OPTIONS = {
    ...DEFAULT_BUFFER_OPTIONS,
    ...incomingOptions,
  }
  webgl.bindBuffer(options.bufferToBindTo, bufferToBind)
  if (dataToBuffer) {
    webgl.bufferData(options.bufferToBindTo, dataToBuffer, options.bufferDataUsageHint)
  }
}
export function sendBufferToAttribute(
  webgl: WebGL2RenderingContext,
  attributeLocation: number,
  options: SendBufferToAttributeOptions
): void {
  const {
    componentsPerIteration,
    sentDataType = webgl.FLOAT,
    shouldNormalizeData = false,
    offsetBetweenIterations = 0,
    offsetOfStart = 0,
  } = options
  webgl.enableVertexAttribArray(attributeLocation)
  webgl.vertexAttribPointer(
    attributeLocation,
    componentsPerIteration,
    sentDataType,
    shouldNormalizeData,
    offsetBetweenIterations,
    offsetOfStart
  )
}
export function uploadImageToTexture(
  webgl: WebGL2RenderingContext,
  target: number,
  textureImage: TexImageSource,
  incomingOptions = {}
): void {
  const options = {
    ...DEFAULT_UPLOAD_OPTIONS,
    ...incomingOptions,
  }
  webgl.texImage2D(
    target,
    options.detailLevel,
    options.internalFormat,
    options.srcFormat,
    options.srcType,
    textureImage
  )
}

// Helper functions and such
export function clearCanvas(webgl: WebGL2RenderingContext) {
  webgl.clearColor(0, 0, 0, 0)
  webgl.clear(webgl.COLOR_BUFFER_BIT)
}
