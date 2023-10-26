import Rapier from "../../../physics/rapier.js";
import { SizeComponent } from "../../../../../shared/component/SizeComponent.js";
import { Entity } from "../../../../../shared/entity/Entity.js";
import { PhysicsColliderComponent } from "../../component/PhysicsColliderComponent.js";
import { EventSizeComponent } from "../../component/events/EventSizeComponent.js";

export class SyncSizeSystem {
  update(entities: Entity[]) {
    for (const entity of entities) {
      const colliderComponent = entity.getComponent(PhysicsColliderComponent);
      const sizeComponent = entity.getComponent(SizeComponent);
      const eventSizeComponent = entity.getComponent(EventSizeComponent);

      if (eventSizeComponent && sizeComponent && colliderComponent) {
        const { width, height, depth } = eventSizeComponent;
        sizeComponent.width = width;
        sizeComponent.height = height;
        sizeComponent.depth = depth;

        let colliderDesc = Rapier.ColliderDesc.cuboid(width, height, depth);
        colliderComponent.collider.setShape(colliderDesc.shape);

        // This will rebroadcast the update to all clients.
        sizeComponent.updated = true;

        entity.removeComponent(EventSizeComponent);
      }
    }
  }
}
