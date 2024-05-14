import { PhysicsBodyComponent } from "../../component/PhysicsBodyComponent.js";
import { PositionComponent } from "../../../../../shared/component/PositionComponent.js";
import { Entity } from "../../../../../shared/entity/Entity.js";
import { ColorComponent } from "../../../../../shared/component/ColorComponent.js";
import { EventColor } from "../../component/events/EventColor.js";
import Rapier from "../../../physics/rapier.js";
import { EntityManager } from "shared/entity/EntityManager.js";
import { EventSystem } from "../events/EventSystem.js";

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
          EventSystem.getInstance().addEvent(
            new EventColor(entity.id, "#" + randomHex)
          );
        }
        bodyComponent.body.setLinvel(new Rapier.Vector3(0, 0, 0), true);
      }
    }
  }
}
