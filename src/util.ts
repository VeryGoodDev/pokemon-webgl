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
