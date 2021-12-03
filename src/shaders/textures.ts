import { isPowerOf2 } from '../math/util'
import { loadImage } from '../util'

export async function loadTexture(webgl: WebGLRenderingContext, url: string): Promise<WebGLTexture> {
  const texture = webgl.createTexture()
  webgl.bindTexture(webgl.TEXTURE_2D, texture)

  const img: HTMLImageElement = await loadImage(url).catch((err) => {
    console.error(`[shaders/textures.ts] An error occurred while trying to fetch an image with URL ${url}:`, err)
    return null
  })
  if (!img) {
    return null
  }

  webgl.texImage2D(
    webgl.TEXTURE_2D,
    0, // level
    webgl.RGBA, // internalFormat
    webgl.RGBA, // srcFormat
    webgl.UNSIGNED_BYTE, // srcType
    img
  )
  if (isPowerOf2(img.width) && isPowerOf2(img.height)) {
    webgl.generateMipmap(webgl.TEXTURE_2D)
  } else {
    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_S, webgl.CLAMP_TO_EDGE)
    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_T, webgl.CLAMP_TO_EDGE)
    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MIN_FILTER, webgl.LINEAR)
  }
  return texture
}
