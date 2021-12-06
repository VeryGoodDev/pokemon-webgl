export function loadFile(url: string): Promise<string> {
  return fetch(url).then((res) => res.text())
}

export function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.addEventListener(`load`, () => resolve(img))
    img.addEventListener(`error`, () => {
      reject(new Error(`Unable to load image with URL ${url}`))
    })
    img.src = url
  })
}

export class Vec2 {
  x: number
  y: number

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  isEqualTo(vec2: Vec2) {
    return this.x === vec2.x && this.y === vec2.y
  }
  toString() {
    return `[${this.x}, ${this.y}]`
  }
}

export class Size {
  width: number
  height: number

  constructor(width: number, height: number) {
    this.width = width
    this.height = height
  }
}
