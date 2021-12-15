export enum PlayerInput {
  DPAD_UP = `DPAD_UP`,
  DPAD_DOWN = `DPAD_DOWN`,
  DPAD_LEFT = `DPAD_LEFT`,
  DPAD_RIGHT = `DPAD_RIGHT`,
  BUTTON_ACTION = `BUTTON_ACTION`,
  BUTTON_CANCEL = `BUTTON_CANCEL`,
  BUTTON_START = `BUTTON_START`,
  BUTTON_SELECT = `BUTTON_SELECT`,
}
interface StateChange {
  action: PlayerInput
  enabled: boolean
}
type Listener = (stateChange: StateChange) => void

const PlayerInputValues = Object.values(PlayerInput)
function validateKeyBindings(keyBindings: Map<string, PlayerInput>): boolean {
  const keyBindingValues = [...keyBindings.values()]
  return (
    keyBindings.size === PlayerInputValues.length &&
    PlayerInputValues.every((value) => keyBindingValues.includes(value))
  )
}

// Heavily inspired by MethMethMethod's KeyboardState class from his Super Mario JS series https://github.com/meth-meth-method/super-mario/blob/master/public/js/KeyboardState.js
class KeyboardInput {
  #boundKeys: Map<string, PlayerInput>
  #currentStates: Map<PlayerInput, boolean>
  #listeners: Listener[]

  constructor() {
    this.#boundKeys = new Map()
    this.#currentStates = new Map()
    this.#listeners = []
  }

  init(): void {
    // TODO: Do these listeners need to be removed at any point?
    window.addEventListener(`keyup`, (evt) => this.#handleStateChange(evt))
    window.addEventListener(`keydown`, (evt) => this.#handleStateChange(evt))
  }
  setKeyBindings(newBindings: Map<string, PlayerInput>): void {
    if (!validateKeyBindings(newBindings)) {
      throw new TypeError(
        `[KeyboardInput::setKeyBindings()] Invalid key bindings provided. Please make sure there are exactly 8 bindings defined, one for each action in the PlayerInput enum`
      )
    }
    this.#boundKeys = newBindings
  }
  subscribe(listener: Listener): void {
    this.#listeners.push(listener)
  }

  #handleStateChange(evt: KeyboardEvent): void {
    // Get the action corresponding to the key event and return early if no match
    const action = this.#boundKeys.get(evt.code)
    if (!action) {
      return
    }
    // Getting to here means we have a corresponding action, so prevent any default behavior associated with that key
    evt.preventDefault()
    // The action is enabled if the key was just pressed, and disabled if just released
    const enabled = evt.type === `keydown`
    // If the previous known state of the action is the same as now, return early
    // This is because holding a key will periodically fire a keydown event, and we only care about when the state of that key changes
    if (this.#currentStates.get(action) === enabled) {
      return
    }
    // Making it to this point means updating the current state of the action and calling any listeners with the updated action data
    this.#currentStates.set(action, enabled)
    for (const listener of this.#listeners) {
      listener({ action, enabled })
    }
  }
}

export default KeyboardInput
