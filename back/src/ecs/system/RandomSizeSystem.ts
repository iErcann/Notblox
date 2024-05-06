import { ColorComponent } from "../../../../shared/component/ColorComponent.js";
import { SingleSizeComponent } from "../../../../shared/component/SingleSizeComponent.js";
import { SizeComponent } from "../../../../shared/component/SizeComponent.js";
import { Entity } from "../../../../shared/entity/Entity.js";
import { RandomizeComponent } from "../component/RandomizeComponent.js";
import { EventColorComponent } from "../component/events/EventColorComponent.js";
import { EventSingleSizeComponent } from "../component/events/EventSingleSizeComponent.js";
import { EventSizeComponent } from "../component/events/EventSizeComponent.js";

export class RandomSizeSystem {
  update(entities: Entity[]) {
    for (const entity of entities) {
      if (!entity.getComponent(RandomizeComponent)) continue;

      const sizeComponent = entity.getComponent(SizeComponent);
      if (sizeComponent) {
        if (Math.random() < 0.01) {
          const { width, height, depth } = sizeComponent;
          const eventSizeComponent = new EventSizeComponent(
            entity.id,
            Math.min(5, width + Math.random() / 3),
            Math.min(5, height + Math.random() / 3),
            Math.min(5, depth + Math.random() / 3)
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

      const singleSizeComponent = entity.getComponent(SingleSizeComponent);
      if (singleSizeComponent) {
        if (Math.random() < 0.1) {
          console.log("New event size component", singleSizeComponent.size + 1);
          entity.addComponent(
            new EventSingleSizeComponent(
              entity.id,
              singleSizeComponent.size + 1 / 10
            )
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
