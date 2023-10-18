import { InputComponent } from "../component/InputComponent.js";
import { Entity } from "../../../../shared/entity/Entity.js";
import { InputMessage } from "../../../../shared/network/client/input.js";
import { WebSocketComponent } from "../component/WebsocketComponent.js";

export class InputProcessingSystem {
  constructor() {}

  // This function simulates receiving an input packet from a client
  // In a real-world scenario, this would involve listening on a network socket
  receiveInputPacket(playerEntity: Entity, inputMessage: InputMessage) {
    // Get or create the InputComponent for the entity
    let inputComponent = playerEntity.getComponent(InputComponent);

    if (!inputComponent) {
      inputComponent = new InputComponent(playerEntity.id);
      playerEntity.addComponent(inputComponent);
    }

    // Update the InputComponent based on the received packet
    inputComponent.down = inputMessage.down;
    inputComponent.up = inputMessage.up;
    inputComponent.left = inputMessage.left;
    inputComponent.right = inputMessage.right;
    inputComponent.space = inputMessage.space;
    inputComponent.lookingYAngle = inputMessage.angleY;
    console.log(inputComponent);
  }
}
