import { CharacterControllerComponent } from "../../component/CharacterControllerComponent.js";
import { PhysicsBodyComponent } from "../../component/PhysicsBodyComponent.js";
import { PositionComponent } from "../../../../../shared/component/PositionComponent.js";
import { Entity } from "../../../../../shared/entity/Entity.js";
import Rapier from "../../../physics/rapier.js";

export class SyncPositionSystem {
  update(entities: Entity[]) {
    entities.forEach((entity) => {
      const bodyComponent = entity.getComponent(PhysicsBodyComponent);
      const positionComponent = entity.getComponent(PositionComponent);

      if (bodyComponent && positionComponent) {
        const position = bodyComponent.body.translation();
        positionComponent.x = position.x;
        positionComponent.y = position.y;
        positionComponent.z = position.z;
      }
    });
  }
}

export class SyncCharacterPositionSystem {
  update(entities: Entity[]) {
    entities.forEach((entity) => {
      const characterComponent = entity.getComponent(
        CharacterControllerComponent
      );
      const positionComponent = entity.getComponent(PositionComponent);

      if (characterComponent && positionComponent) {
        const position =
          characterComponent.characterController.computedMovement();
        positionComponent.x = position.x;
        positionComponent.y = position.y;
        positionComponent.z = position.z;
      }
    });
  }
}
