import { CharacterControllerComponent } from "../component/CharacterControllerComponent.js";
import { Entity } from "../../../../shared/entity/Entity.js";

export class CharacterControllerSystem {
  update(entities: Entity[]) {
    entities.forEach((entity) => {
      const controllerComp = entity.getComponent<CharacterControllerComponent>(
        CharacterControllerComponent
      );

      if (controllerComp && controllerComp.desiredTranslation) {
        // Compute the movement based on the character controller.
        // controllerComp.characterController.computeColliderMovement(
        //   controllerComp.desiredTranslation
        // );

        // You can then retrieve the corrected movement and apply it to the entity's position or other components.
        // For example:
        // const correctedMovement = controllerComp.characterController.computedMovement();
        // ... apply this movement to the entity ...

        // Reset the desiredTranslation for the next frame.
        controllerComp.desiredTranslation = null;
      }
    });
  }
}
