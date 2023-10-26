import Rapier from "../../physics/rapier.js";
import { ColorComponent } from "../../../../shared/component/ColorComponent.js";
import { SizeComponent } from "../../../../shared/component/SizeComponent.js";
import { Entity } from "../../../../shared/entity/Entity.js";
import { PhysicsBodyComponent } from "../component/PhysicsBodyComponent.js";
import { EventColorComponent } from "../component/events/EventColorComponent.js";
import { EventSizeComponent } from "../component/events/EventSizeComponent.js";
import { PlayerComponent } from "../component/PlayerComponent.js";
import { PositionComponent } from "../../../../shared/component/PositionComponent.js";

export class RandomSizeSystem {
  update(entities: Entity[]) {
    for (const entity of entities) {
      const sizeComponent = entity.getComponent(SizeComponent);
      if (sizeComponent) {
        if (Math.random() < 0.01) {
          const { width, height, depth } = sizeComponent;
          const eventSizeComponent = new EventSizeComponent(
            entity.id,
            Math.max(0.5, width + Math.random() / 3),
            Math.max(0.5, height + Math.random() / 3),
            Math.max(0.5, depth + Math.random() / 3)
          );
          entity.addComponent(eventSizeComponent);
        }
      }

      const colorComponent = entity.getComponent(ColorComponent);
      if (colorComponent) {
        if (Math.random() < 0.01) {
          const randomHex = Math.floor(Math.random() * 16777215).toString(16);
          entity.addComponent(
            new EventColorComponent(entity.id, "#" + randomHex)
          );
        }
      }

      // const playerComponent = entity.getComponent(PlayerComponent);
      // const positionComponent = entity.getComponent(PositionComponent);
      // const rigidBodyComponent = entity.getComponent(PhysicsBodyComponent);

      // if (playerComponent && positionComponent && rigidBodyComponent) {
      //   if (positionComponent.x < -50) {
      //     rigidBodyComponent.body.setTranslation(
      //       new Rapier.Vector3(0, 10, 0),
      //       true
      //     );
      //   }
      // }

      // const rigidBodyComponent = entity.getComponent(PhysicsBodyComponent);
      // if (rigidBodyComponent) {
      //   if (Math.random() < 0.5) {
      //     rigidBodyComponent.body.applyImpulse(
      //       new Rapier.Vector3(10, 0, 0),
      //       true
      //     );
      //   }
      // }
    }
  }
}
