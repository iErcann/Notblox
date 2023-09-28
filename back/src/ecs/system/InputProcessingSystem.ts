import { InputPacket } from "../../inputPacket.js";
import { InputComponent } from "../component/InputComponent.js";
import { Entity } from "../entity/entity.js";

export class InputProcessingSystem {
  private entities: Entity[]; // All entities in the game world

  constructor(entities: Entity[]) {
    this.entities = entities;
  }

  // This function simulates receiving an input packet from a client
  // In a real-world scenario, this would involve listening on a network socket
  receiveInputPacket(packet: InputPacket) {
    // Find the entity with the given ID
    const entity = this.entities.find((e) => e.id === packet.entityId);

    if (!entity) {
      console.error(`Entity with ID ${packet.entityId} not found.`);
      return;
    }

    // Get or create the InputComponent for the entity
    let inputComponent = entity.getComponent<InputComponent>(InputComponent);

    if (!inputComponent) {
      inputComponent = new InputComponent(entity.id);
      entity.addComponent(inputComponent);
    }

    // Update the InputComponent based on the received packet
    inputComponent.forward = packet.forward;
    inputComponent.backward = packet.backward;
    inputComponent.left = packet.left;
    inputComponent.right = packet.right;
  }
}
