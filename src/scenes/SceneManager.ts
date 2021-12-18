// TODO: draw method that draws two layers: background layer (with the background image of the scene, different from the background layer for solid colors) and entity layer on top of that, drawing all entites that are currently visible
// TODO: Only draw entities that are within view of the camera (centered on the player usually), plus a little leeway to allow moving entities that could potentially move into view to continue updating
// TODO: Track entities, update per scene change
// TODO: Handle scene changes, including background swap, entrance point, exit points, etc.
// TODO: Sets up scene collision boundaries

import type KeyboardInput from '../KeyboardInput'
import type { StateChange } from '../KeyboardInput'
import type { Vec2 } from '../util'
import type Scene from './Scene'
import { PlayerInput } from '../KeyboardInput'
import { Colors } from '../constants'

// TODO: Determine background color, provide method to get that info (will usually be the out-of-bounds gray AFAIK)
export interface EntityUpdateData {
  position?: Vec2
  direction?: Direction
}
export interface SceneState {
  backdropColor: string
  currentDirection: Direction
  playerIsMoving: boolean
}

export enum Direction {
  NORTH = `NORTH`,
  SOUTH = `SOUTH`,
  EAST = `EAST`,
  WEST = `WEST`,
}

const INITIAL_SCENE_STATE: SceneState = {
  // FIXME: Eventually should be whatever the backdrop color is of the loaded game, or beginning of game if no load
  backdropColor: Colors.OUT_OF_BOUNDS_BACKGROUND,
  currentDirection: Direction.SOUTH,
  playerIsMoving: false,
}

function calculateCurrentDirection(heldDirectionInputs: PlayerInput[]): Direction {
  // Based on what I've observed in my emulator, this is the order of which direction input gets the highest priority when multiple are held. So this just goes down the conditionals until it finds a direction to match, or returns null if there are no matches (aka there are no direction inputs being held down at the moment)
  if (heldDirectionInputs.includes(PlayerInput.DPAD_UP)) {
    return Direction.NORTH
  }
  if (heldDirectionInputs.includes(PlayerInput.DPAD_DOWN)) {
    return Direction.SOUTH
  }
  if (heldDirectionInputs.includes(PlayerInput.DPAD_LEFT)) {
    return Direction.WEST
  }
  if (heldDirectionInputs.includes(PlayerInput.DPAD_RIGHT)) {
    return Direction.EAST
  }
  return null
}

class SceneManager {
  #currentScene: Scene
  #keyboardInput: KeyboardInput
  #state: SceneState = INITIAL_SCENE_STATE
  #heldDirectionInputs: PlayerInput[] = []

  constructor(keyboardInput: KeyboardInput) {
    this.#currentScene = null
    this.#keyboardInput = keyboardInput
    this.#keyboardInput.subscribe((stateChange) => this.#handleInput(stateChange))
  }

  get currentDirection(): Direction {
    return calculateCurrentDirection(this.#heldDirectionInputs)
  }

  getCurrentScene(): Scene {
    return this.#currentScene
  }
  setCurrentScene(scene: Scene): void {
    this.#currentScene = scene
  }
  updateScene(deltaTime = 1 / 60): void {
    this.getCurrentScene().update(this.#state, deltaTime)
  }

  #handleInput({ action, enabled }: StateChange): void {
    switch (action) {
      // Movement changes
      case PlayerInput.DPAD_UP:
      case PlayerInput.DPAD_DOWN:
      case PlayerInput.DPAD_LEFT:
      case PlayerInput.DPAD_RIGHT:
        if (enabled) {
          this.#heldDirectionInputs.push(action)
        } else {
          this.#heldDirectionInputs.splice(this.#heldDirectionInputs.indexOf(action), 1)
        }
        this.#state.currentDirection = this.currentDirection
        this.#state.playerIsMoving = this.#heldDirectionInputs.length > 0
        break

      // Functional buttons
      case PlayerInput.BUTTON_ACTION:
        // TODO: Try to pick up item, talk to NPC, read sign, etc.
        console.log(`${PlayerInput.BUTTON_ACTION} ${enabled ? `pressed` : `released`}`)
        break
      case PlayerInput.BUTTON_CANCEL:
        // TODO: Continue through dialog, go back one in menu, etc.
        console.log(`${PlayerInput.BUTTON_CANCEL} ${enabled ? `pressed` : `released`}`)
        break
      case PlayerInput.BUTTON_START:
        // TODO: Toggle menu visible if in top level menu or options menu
        console.log(`${PlayerInput.BUTTON_START} ${enabled ? `pressed` : `released`}`)
        break
      case PlayerInput.BUTTON_SELECT:
        // TODO: Use registered item or tell player they can register an item
        console.log(`${PlayerInput.BUTTON_SELECT} ${enabled ? `pressed` : `released`}`)
        break
    }
    // Regardless of what the update was, we want to update the scene
    this.updateScene()
  }
}

export default SceneManager
