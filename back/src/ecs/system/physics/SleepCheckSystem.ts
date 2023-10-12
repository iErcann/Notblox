import { CharacterControllerComponent } from "../../component/CharacterControllerComponent.js";
import { PhysicsBodyComponent } from "../../component/PhysicsBodyComponent.js";
import { PositionComponent } from "../../../../../shared/component/PositionComponent.js";
import { Entity } from "../../../../../shared/entity/Entity.js";
import { RotationComponent } from "../../../../../shared/component/RotationComponent.js";

export class SleepCheckSystem {
  update(entities: Entity[]) {
    entities.forEach((entity) => {
      const bodyComponent = entity.getComponent(PhysicsBodyComponent);

      if (bodyComponent) {
        const sleeping = bodyComponent.body.isSleeping();
        const positionComponent = entity.getComponent(PositionComponent);
        if (positionComponent) {
          positionComponent.isSent = !sleeping;
        }
        const rotationComponent = entity.getComponent(RotationComponent);
        if (rotationComponent) {
          rotationComponent.isSent = !sleeping;
        }
      }
    });
  }
}
