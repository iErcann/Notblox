import { ClientMessageType } from "@shared/network/client/base";
import { InputMessage } from "@shared/network/client/input";
import { WebSocketManager } from "./WebsocketManager";

export enum KeyboardLanguage {
  FR = "fr",
  EN = "en",
}
export class InputManager {
  public inputState: InputMessage = {
    t: ClientMessageType.INPUT,
    up: false,
    down: false,
    left: false,
    right: false,
    space: false,
    cameraLeft: false,
    cameraRight: false,
    angleY: 0,
  };

  private keyboardLanguage: KeyboardLanguage = KeyboardLanguage.EN;

  constructor(private webSocketManager: WebSocketManager) {
    // Retrieve keyboard language from local storage, defaulting to EN if not found
    const savedLanguage = localStorage.getItem("keyboardLanguage");
    this.keyboardLanguage = savedLanguage
      ? (savedLanguage as KeyboardLanguage)
      : KeyboardLanguage.EN;

    // Add event listeners to handle user input
    window.addEventListener("keydown", this.handleKeyDown.bind(this));
    window.addEventListener("keyup", this.handleKeyUp.bind(this));
  }

  private handleKeyDown(event: KeyboardEvent) {
    switch (this.keyboardLanguage) {
      case KeyboardLanguage.EN:
        switch (event.key) {
          case "ArrowUp":
          case "W":
          case "w":
            this.inputState.up = true;
            break;
          case "ArrowDown":
          case "S":
          case "s":
            this.inputState.down = true;
            break;
          case "ArrowLeft":
          case "A":
          case "a":
            this.inputState.left = true;
            break;
          case "ArrowRight":
          case "D":
          case "d":
            this.inputState.right = true;
            break;
          case " ":
            this.inputState.space = true;
            break;
          case "Q":
          case "q":
            this.inputState.cameraLeft = true;
            break;
          case "E":
          case "e":
            this.inputState.cameraRight = true;
            break;
        }
        break;
      case KeyboardLanguage.FR:
        switch (event.key) {
          case "ArrowUp":
          case "Z":
          case "z":
            this.inputState.up = true;
            break;
          case "ArrowDown":
          case "S":
          case "s":
            this.inputState.down = true;
            break;
          case "ArrowLeft":
          case "Q":
          case "q":
            this.inputState.left = true;
            break;
          case "ArrowRight":
          case "D":
          case "d":
            this.inputState.right = true;
            break;
          case " ":
            this.inputState.space = true;
            break;
          case "A":
          case "a":
            this.inputState.cameraLeft = true;
            break;
          case "E":
          case "e":
            this.inputState.cameraRight = true;
            break;
        }
        break;
    }
  }

  private handleKeyUp(event: KeyboardEvent) {
    switch (this.keyboardLanguage) {
      case KeyboardLanguage.EN:
        switch (event.key) {
          case "ArrowUp":
          case "W":
          case "w":
            this.inputState.up = false;
            break;
          case "ArrowDown":
          case "S":
          case "s":
            this.inputState.down = false;
            break;
          case "ArrowLeft":
          case "A":
          case "a":
            this.inputState.left = false;
            break;
          case "ArrowRight":
          case "D":
          case "d":
            this.inputState.right = false;
            break;
          case " ":
            this.inputState.space = false;
            break;
          case "Q":
          case "q":
            this.inputState.cameraLeft = false;
            break;
          case "E":
          case "e":
            this.inputState.cameraRight = false;
            break;
        }
        break;
      case KeyboardLanguage.FR:
        switch (event.key) {
          case "ArrowUp":
          case "Z":
          case "z":
            this.inputState.up = false;
            break;
          case "ArrowDown":
          case "S":
          case "s":
            this.inputState.down = false;
            break;
          case "ArrowLeft":
          case "Q":
          case "q":
            this.inputState.left = false;
            break;
          case "ArrowRight":
          case "D":
          case "d":
            this.inputState.right = false;
            break;
          case " ":
            this.inputState.space = false;
            break;
          case "A":
          case "a":
            this.inputState.cameraLeft = false;
            break;
          case "E":
          case "e":
            this.inputState.cameraRight = false;
            break;
        }
        break;
    }
  }

  public sendInput() {
    // Send the updated input state to the WebSocketManager
    this.webSocketManager.send(this.inputState);
  }
}
