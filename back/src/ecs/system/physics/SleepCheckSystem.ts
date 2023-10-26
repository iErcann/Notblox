import { ColorComponent } from "../../../../../shared/component/ColorComponent.js";
import { PositionComponent } from "../../../../../shared/component/PositionComponent.js";
import { RotationComponent } from "../../../../../shared/component/RotationComponent.js";
import { SizeComponent } from "../../../../../shared/component/SizeComponent.js";
import { Entity } from "../../../../../shared/entity/Entity.js";
import { PhysicsBodyComponent } from "../../component/PhysicsBodyComponent.js";

export class SleepCheckSystem {
  update(entities: Entity[]) {
    for (const entity of entities) {
      const bodyComponent = entity.getComponent(PhysicsBodyComponent);

      if (bodyComponent) {
        const sleeping = bodyComponent.body.isSleeping();
        const positionComponent = entity.getComponent(PositionComponent);
        if (positionComponent) {
          positionComponent.updated = !sleeping;
        }
        const rotationComponent = entity.getComponent(RotationComponent);
        if (rotationComponent) {
          rotationComponent.updated = !sleeping;
        }

        const sizeComponent = entity.getComponent(SizeComponent);
        if (sizeComponent) {
          sizeComponent.updated = false;
        }
        const colorComponent = entity.getComponent(ColorComponent);
        if (colorComponent) {
          colorComponent.updated = false;
        }
      }
    }
  }
}
