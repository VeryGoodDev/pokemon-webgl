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
export interface TextureImageSource {
  height: number
  width: number
}
interface UploadOptions {
  /** 0 (default) is base image level, any other number n is the nth mipmap reduction level */
  detailLevel: number
  /** What color format is in the texture */
  internalFormat: number
  /** Width of the texture, defaults to the texture image source's width */
  width?: number
  /** Height of the texture, defaults to the texture image source's height */
  height?: number
  /** Specifies the border width, but always has to be 0 for some reason idk */
  border?: number
  /** Format of the data being supplied through the texture */
  srcFormat: number
  /** Data type of the data being supplied through the texture */
  srcType: number
}

// Constants
const DEFAULT_BUFFER_OPTIONS = {
  bufferToBindTo: WebGL2RenderingContext.ARRAY_BUFFER,
  bufferDataUsageHint: WebGL2RenderingContext.STATIC_DRAW,
}
const DEFAULT_UPLOAD_OPTIONS: UploadOptions = {
  /** 0 (default) is base image level, any other number n is the nth mipmap reduction level */
  detailLevel: 0,
  /** What color format is in the texture */
  internalFormat: WebGL2RenderingContext.RGBA,
  /** Format of the data being supplied through the texture */
  srcFormat: WebGL2RenderingContext.RGBA,
  /** Data type of the data being supplied through the texture */
  srcType: WebGL2RenderingContext.UNSIGNED_BYTE,
}
const NON_ZERO_BORDER_WARNING = `[webgl-utils.ts] A border with a value not equaling 0 was provided to uploadImageToTexture, but according to the spec the value of this property must be 0. I don't know what the whole deal is with all of that, but if something isn't behaving quite right, this might be a good place to look`

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
// FIXME: Dedupe common code between uploadColor and uploadTexture
export function uploadColorToTexture(
  webgl: WebGL2RenderingContext,
  target: number,
  color: Uint8Array,
  incomingOptions = {}
): void {
  const options = {
    ...DEFAULT_UPLOAD_OPTIONS,
    ...incomingOptions,
  }
  const { width = 1, height = 1, border = 0 } = options
  if (border !== 0) {
    console.warn(NON_ZERO_BORDER_WARNING)
  }
  webgl.texImage2D(
    target,
    options.detailLevel,
    options.internalFormat,
    width,
    height,
    border,
    options.srcFormat,
    options.srcType,
    color
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
  const { width = textureImage.width, height = textureImage.height, border = 0 } = options
  if (border !== 0) {
    console.warn(NON_ZERO_BORDER_WARNING)
  }
  webgl.texImage2D(
    target,
    options.detailLevel,
    options.internalFormat,
    width,
    height,
    border,
    options.srcFormat,
    options.srcType,
    textureImage
  )
}
// The "S" coordinate of a texture is equivalent to the X axis as far as I can tell
export function disableTextureWrappingS(webgl: WebGL2RenderingContext, target: number): void {
  webgl.texParameteri(target, webgl.TEXTURE_WRAP_S, webgl.CLAMP_TO_EDGE)
}
// The "T" coordinate of a texture is equivalent to the Y axis as far as I can tell
export function disableTextureWrappingT(webgl: WebGL2RenderingContext, target: number): void {
  webgl.texParameteri(target, webgl.TEXTURE_WRAP_T, webgl.CLAMP_TO_EDGE)
}
export function disableTextureWrapping(webgl: WebGL2RenderingContext, target: number): void {
  disableTextureWrappingS(webgl, target)
  disableTextureWrappingT(webgl, target)
}
export function disableTextureMipmapping(webgl: WebGL2RenderingContext, target: number): void {
  webgl.texParameteri(target, webgl.TEXTURE_MIN_FILTER, webgl.NEAREST)
}
export function disableTextureMagnification(webgl: WebGL2RenderingContext, target: number): void {
  webgl.texParameteri(target, webgl.TEXTURE_MAG_FILTER, webgl.NEAREST)
}

// Helper functions and such
export function clearCanvas(webgl: WebGL2RenderingContext) {
  webgl.clearColor(0, 0, 0, 0)
  webgl.clear(webgl.COLOR_BUFFER_BIT)
}
