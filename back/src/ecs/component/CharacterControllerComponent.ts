import Rapier from "../../physics/rapier.js";
import { Component } from "../../../../shared/component/Component.js";

export class CharacterControllerComponent extends Component {
  characterController: Rapier.KinematicCharacterController; // Holds the character controller instance.
  desiredTranslation: any = null; // Holds desired movement input.

  constructor(entityId: number, world: Rapier.World, offset: number = 0.01) {
    super(entityId);

    // Initialize the character controller with the provided offset.
    this.characterController = world.createCharacterController(offset);
  }
}
