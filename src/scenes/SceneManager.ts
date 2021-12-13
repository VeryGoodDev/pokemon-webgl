// TODO: draw method that draws two layers: background layer (with the background image of the scene, different from the background layer for solid colors) and entity layer on top of that, drawing all entites that are currently visible
// TODO: Only draw entities that are within view of the camera (centered on the player usually), plus a little leeway to allow moving entities that could potentially move into view to continue updating
// TODO: Track entities, update per scene change
// TODO: Handle scene changes, including background swap, entrance point, exit points, etc.
// TODO: Sets up scene collision boundaries

import type { Vec2 } from '../util'
import Scene from './Scene'

// TODO: Determine background color, provide method to get that info (will usually be the out-of-bounds gray AFAIK)
export interface EntityUpdateData {
  position?: Vec2
  direction?: Direction
}
interface SceneState {
  backdropColor: string
}

export enum Direction {
  NORTH = `NORTH`,
  SOUTH = `SOUTH`,
  EAST = `EAST`,
  WEST = `WEST`,
}

class SceneManager {
  #currentScene: Scene
  #state: SceneState

  constructor() {
    this.#currentScene = null
  }

  getCurrentScene(): Scene {
    return this.#currentScene
  }
  setCurrentScene(scene: Scene): void {
    this.#currentScene = scene
  }
}

export default SceneManager
