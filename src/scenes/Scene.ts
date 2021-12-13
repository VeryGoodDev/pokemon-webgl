import type Entity from '../entities/Entity'

export interface SceneData {
  entities: Entity[]
  background: TexImageSource
}

class Scene {
  #sceneData: SceneData

  constructor(sceneData: SceneData) {
    this.#sceneData = sceneData
  }

  // drawScene(): void {}
}

export default Scene
