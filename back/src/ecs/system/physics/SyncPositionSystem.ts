import { CharacterControllerComponent } from "../../component/CharacterControllerComponent.js";
import { PhysicsBodyComponent } from "../../component/PhysicsBodyComponent.js";
import { PositionComponent } from "../../component/PositionComponent.js";
import { Entity } from "../../entity/entity.js";

export class SyncPositionSystem {
  update(entities: Entity[]) {
    entities.forEach((entity) => {
      const bodyComponent =
        entity.getComponent<PhysicsBodyComponent>(PhysicsBodyComponent);
      const positionComponent =
        entity.getComponent<PositionComponent>(PositionComponent);

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
      const characterComponent =
        entity.getComponent<CharacterControllerComponent>(
          CharacterControllerComponent
        );
      const positionComponent =
        entity.getComponent<PositionComponent>(PositionComponent);

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
