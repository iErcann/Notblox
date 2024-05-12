import { PositionComponent } from "../../../../shared/component/PositionComponent.js";
import { ColorComponent } from "../../../../shared/component/ColorComponent.js";
import { SingleSizeComponent } from "../../../../shared/component/SingleSizeComponent.js";
import { SizeComponent } from "../../../../shared/component/SizeComponent.js";
import { Entity } from "../../../../shared/entity/Entity.js";
import { PhysicsBodyComponent } from "../component/PhysicsBodyComponent.js";
import { PlayerComponent } from "../component/tag/PlayerComponent.js";
import { RandomizeComponent } from "../component/RandomizeComponent.js";
import { EventColor } from "../component/events/EventColor.js";
import { EventSingleSize } from "../component/events/EventSingleSize.js";
import { EventSize } from "../component/events/EventSize.js";
import Rapier from "../../physics/rapier.js";
import { EntityManager } from "../../../../shared/entity/EntityManager.js";
import { SerializedEntityType } from "../../../../shared/network/server/serialized.js";
import { ChatListComponent } from "../../../../shared/component/ChatComponent.js";

export class RandomSizeSystem {
  update(entities: Entity[]) {
    for (const entity of entities) {
      if (!entity.getComponent(RandomizeComponent)) continue;

      const sizeComponent = entity.getComponent(SizeComponent);
      // if (sizeComponent) {
      //   if (Math.random() < 0.01) {
      //     const { width, height, depth } = sizeComponent;
      //     const eventSizeComponent = new EventSizeComponent(
      //       entity.id,
      //       Math.min(5, width + Math.random() / 3),
      //       Math.min(5, height + Math.random() / 3),
      //       Math.min(5, depth + Math.random() / 3)
      //     );
      //     entity.addComponent(eventSizeComponent);
      //   }
      // }

      const colorComponent = entity.getComponent(ColorComponent);

      if (colorComponent) {
        if (Math.random() < 0.01) {
          const randomHex = Math.floor(Math.random() * 16777215).toString(16);
          entity.addComponent(new EventColor(entity.id, "#" + randomHex));
        }
      }

      const rigidBodyComponent = entity.getComponent(PhysicsBodyComponent);

      if (rigidBodyComponent) {
        if (Math.random() < 0.05) {
          // const chatEntity = EntityManager.getFirstEntityByType(
          //   entities,
          //   SerializedEntityType.CHAT
          // );
          // chatEntity
          //   ?.getComponent(ChatListComponent)
          //   ?.addMessage("Server", Math.random().toString());

          rigidBodyComponent.body.applyImpulse(
            new Rapier.Vector3(
              (Math.random() - 1 / 2) * 500,
              (Math.random() - 1 / 2) * 500,
              (Math.random() - 1 / 2) * 500
            ),
            true
          );
        }
      }
    }
  }
}
