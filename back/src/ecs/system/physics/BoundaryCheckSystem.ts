import { PhysicsBodyComponent } from "../../component/PhysicsBodyComponent.js";
import { PositionComponent } from "../../../../../shared/component/PositionComponent.js";
import { Entity } from "../../../../../shared/entity/Entity.js";
import { ColorComponent } from "../../../../../shared/component/ColorComponent.js";
import { EventColorComponent } from "../../component/events/EventColorComponent.js";
import Rapier from "../../../physics/rapier.js";

export class BoundaryCheckSystem {
  update(entities: Entity[]) {
    for (const entity of entities) {
      const bodyComponent = entity.getComponent(PhysicsBodyComponent);
      const positionComponent = entity.getComponent(PositionComponent);

      if (bodyComponent && positionComponent && positionComponent.y < -40) {
        bodyComponent.body.setTranslation(
          {
            x: 0,
            y: 4,
            z: 0,
          },
          true
        );
        const colorComponent = entity.getComponent(ColorComponent);
        if (colorComponent) {
          const randomHex = Math.floor(Math.random() * 16777215).toString(16);
          entity.addComponent(
            new EventColorComponent(entity.id, "#" + randomHex)
          );
        }
        bodyComponent.body.setLinvel(new Rapier.Vector3(0, 0, 0), true);
      }
    }
  }
}
