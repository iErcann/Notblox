import { ClientMessageType } from '@shared/network/client/base'
import { InputMessage } from '@shared/network/client/input'
import { IJoystickUpdateEvent } from 'react-joystick-component/build/lib/Joystick'
import { OrbitCameraFollowSystem } from './ecs/system'
import { WebSocketManager } from './WebsocketManager'

export enum KeyboardLanguage {
  FR = 'fr',
  EN = 'en',
}

export class InputManager {
  pcUser: boolean = true
  inputState: InputMessage = {
    t: ClientMessageType.INPUT,
    // UP
    u: false,
    // DOWN
    d: false,
    // LEFT
    l: false,
    // RIGHT
    r: false,
    // SPACE
    s: false,
    y: 0,
  }

  private keyboardLanguage: KeyboardLanguage = KeyboardLanguage.EN
  private cameraFollowSystem: OrbitCameraFollowSystem // Add a reference to the camera follow system

  constructor(
    private webSocketManager: WebSocketManager,
    cameraFollowSystem: OrbitCameraFollowSystem
  ) {
    this.cameraFollowSystem = cameraFollowSystem // Initialize the camera follow system

    // Retrieve keyboard language from local storage, defaulting to EN if not found
    const savedLanguage = localStorage.getItem('keyboardLanguage')
    this.keyboardLanguage = savedLanguage
      ? (savedLanguage as KeyboardLanguage)
      : KeyboardLanguage.EN

    // Add event listeners to handle user input
    window.addEventListener('keydown', this.handleKeyDown.bind(this))
    window.addEventListener('keyup', this.handleKeyUp.bind(this))
    window.addEventListener('keypress', this.handleKeyPress.bind(this))
  }

  private isGameFocused(event: KeyboardEvent) {
    return event.target === document.body
  }

  public handleJoystickMove(joystick: IJoystickUpdateEvent) {
    this.pcUser = false
    // Calculate angle from current looking direction vs joystick direction
    const joystickAngleRad = Math.atan2(joystick.x!, joystick.y!)

    // Adjust the joystick angle by the camera's azimuth angle
    const adjustedJoystickAngleRad = joystickAngleRad + this.cameraFollowSystem.y

    // Calculate the difference between the current looking direction and the joystick direction
    this.inputState.y = adjustedJoystickAngleRad
    this.inputState.u = true
  }

  public handleJoystickStop(joystick: IJoystickUpdateEvent) {
    this.inputState.u = false
  }

  private handleKeyPress(event: KeyboardEvent) {
    this.inputState.y = this.cameraFollowSystem.y
  }
  private handleKeyDown(event: KeyboardEvent) {
    if (!this.pcUser) this.pcUser = true
    if (!this.isGameFocused(event)) return
    switch (this.keyboardLanguage) {
      case KeyboardLanguage.EN:
        switch (event.key) {
          case 'ArrowUp':
          case 'W':
          case 'w':
            this.inputState.u = true
            break
          case 'ArrowDown':
          case 'S':
          case 's':
            this.inputState.d = true
            break
          case 'ArrowLeft':
          case 'A':
          case 'a':
            this.inputState.l = true
            break
          case 'ArrowRight':
          case 'D':
          case 'd':
            this.inputState.r = true
            break
          case ' ':
            this.inputState.s = true
            break
        }
        break
      case KeyboardLanguage.FR:
        switch (event.key) {
          case 'ArrowUp':
          case 'Z':
          case 'z':
            this.inputState.u = true
            break
          case 'ArrowDown':
          case 'S':
          case 's':
            this.inputState.d = true
            break
          case 'ArrowLeft':
          case 'Q':
          case 'q':
            this.inputState.l = true
            break
          case 'ArrowRight':
          case 'D':
          case 'd':
            this.inputState.r = true
            break
          case ' ':
            this.inputState.s = true
            break
        }
        break
    }
  }

  private handleKeyUp(event: KeyboardEvent) {
    switch (this.keyboardLanguage) {
      case KeyboardLanguage.EN:
        switch (event.key) {
          case 'ArrowUp':
          case 'W':
          case 'w':
            this.inputState.u = false
            break
          case 'ArrowDown':
          case 'S':
          case 's':
            this.inputState.d = false
            break
          case 'ArrowLeft':
          case 'A':
          case 'a':
            this.inputState.l = false
            break
          case 'ArrowRight':
          case 'D':
          case 'd':
            this.inputState.r = false
            break
          case ' ':
            this.inputState.s = false
            break
        }
        break
      case KeyboardLanguage.FR:
        switch (event.key) {
          case 'ArrowUp':
          case 'Z':
          case 'z':
            this.inputState.u = false
            break
          case 'ArrowDown':
          case 'S':
          case 's':
            this.inputState.d = false
            break
          case 'ArrowLeft':
          case 'Q':
          case 'q':
            this.inputState.l = false
            break
          case 'ArrowRight':
          case 'D':
          case 'd':
            this.inputState.r = false
            break
          case ' ':
            this.inputState.s = false
            break
        }
        break
    }
  }

  private previousInputState: InputMessage | null = null

  // TODO: To lower the bandiwdth even more, send at a maxrate of config.SERVER_TICKRATE
  // Only sending when the input state changes
  sendInput() {
    // Check if the current input state is different from the previous one
    if (
      !this.previousInputState ||
      !this.areInputStatesEqual(this.inputState, this.previousInputState)
    ) {
      // Send the updated input state to the WebSocketManager
      this.webSocketManager.send(this.inputState)

      // Update the previous input state
      this.previousInputState = { ...this.inputState }
    }
  }

  private areInputStatesEqual(state1: InputMessage, state2: InputMessage): boolean {
    return (
      state1.u === state2.u &&
      state1.d === state2.d &&
      state1.l === state2.l &&
      state1.r === state2.r &&
      state1.s === state2.s &&
      state1.y === state2.y
    )
  }
}
