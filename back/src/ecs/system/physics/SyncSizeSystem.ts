import Rapier from "../../../physics/rapier.js";
import { SizeComponent } from "../../../../../shared/component/SizeComponent.js";
import { Entity } from "../../../../../shared/entity/Entity.js";
import { PhysicsColliderComponent } from "../../component/PhysicsColliderComponent.js";

export class SyncSizeSystem {
  update(entities: Entity[]) {
    entities.forEach((entity) => {
      const colliderComponent = entity.getComponent(PhysicsColliderComponent);
      const sizeComponent = entity.getComponent(SizeComponent);

      if (colliderComponent && sizeComponent) {
        let colliderDesc = Rapier.ColliderDesc.cuboid(
          sizeComponent.width,
          sizeComponent.height,
          sizeComponent.depth
        );
        colliderComponent.collider.setShape(colliderDesc.shape);
      }
    });
  }
}
