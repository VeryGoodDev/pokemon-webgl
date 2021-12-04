type SentDataTypeOption =
  | WebGL2RenderingContext[`FLOAT`]
  | WebGL2RenderingContext[`SHORT`]
  | WebGL2RenderingContext[`BYTE`]
  | WebGL2RenderingContext[`UNSIGNED_SHORT`]
  | WebGL2RenderingContext[`UNSIGNED_BYTE`]
  | WebGL2RenderingContext[`HALF_FLOAT`]
export interface SendBufferToAttributeOptions {
  componentsPerIteration: number
  sentDataType?: SentDataTypeOption
  shouldNormalizeData?: boolean
  offsetBetweenIterations?: number
  offsetOfStart?: number
}

const DEFAULT_BUFFER_OPTIONS = {
  bufferToBindTo: WebGL2RenderingContext.ARRAY_BUFFER,
  bufferDataUsageHint: WebGL2RenderingContext.STATIC_DRAW,
}

export function bufferData(
  webgl: WebGL2RenderingContext,
  bufferToBind: WebGLBuffer,
  dataToBuffer: BufferSource = null,
  incomingOptions = {}
): void {
  const options: typeof DEFAULT_BUFFER_OPTIONS = {
    ...incomingOptions,
    ...DEFAULT_BUFFER_OPTIONS,
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

export function clearCanvas(webgl: WebGL2RenderingContext) {
  webgl.clearColor(0, 0, 0, 0)
  webgl.clear(webgl.COLOR_BUFFER_BIT)
}
