import { PhysicsBodyComponent } from "../../component/PhysicsBodyComponent.js";
import { PositionComponent } from "../../../../../shared/component/PositionComponent.js";
import { Entity } from "../../../../../shared/entity/Entity.js";
import { ColorComponent } from "../../../../../shared/component/ColorComponent.js";
import { EventColorComponent } from "../../component/events/EventColorComponent.js";

export class BoundaryCheckSystem {
  update(entities: Entity[]) {
    for (const entity of entities) {
      const bodyComponent = entity.getComponent(PhysicsBodyComponent);
      const positionComponent = entity.getComponent(PositionComponent);

      if (bodyComponent && positionComponent && positionComponent.y < -10) {
        bodyComponent.body.setTranslation(
          {
            x: 0,
            y: 10,
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
      }
    }
  }
}
