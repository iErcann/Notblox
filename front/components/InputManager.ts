import { ClientMessageType } from "@shared/network/client/base";
import { InputMessage } from "@shared/network/client/input";
import { WebSocketManager } from "./WebsocketManager";

export class InputManager {
  private readonly inputState: InputMessage = {
    t: ClientMessageType.INPUT,
    up: false,
    down: false,
    left: false,
    right: false,
  };

  constructor(private webSocketManager: WebSocketManager) {
    // Add event listeners to handle user input
    window.addEventListener("keydown", this.handleKeyDown.bind(this));
    window.addEventListener("keyup", this.handleKeyUp.bind(this));
  }

  private handleKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case "ArrowUp":
        this.inputState.up = true;
        break;
      case "ArrowDown":
        this.inputState.down = true;
        break;
      case "ArrowLeft":
        this.inputState.left = true;
        break;
      case "ArrowRight":
        this.inputState.right = true;
        break;
    }
    this.sendInput();
  }

  private handleKeyUp(event: KeyboardEvent) {
    switch (event.key) {
      case "ArrowUp":
        this.inputState.up = false;
        break;
      case "ArrowDown":
        this.inputState.down = false;
        break;
      case "ArrowLeft":
        this.inputState.left = false;
        break;
      case "ArrowRight":
        this.inputState.right = false;
        break;
    }
    this.sendInput();
  }

  private sendInput() {
    // Send the updated input state to the WebSocketManager
    this.webSocketManager.send(this.inputState);
  }
}
