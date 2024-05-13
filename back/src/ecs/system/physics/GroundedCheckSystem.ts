import { PositionComponent } from "../../../../../shared/component/PositionComponent.js";
import { PhysicsBodyComponent } from "../../component/PhysicsBodyComponent.js";
import { Entity } from "../../../../../shared/entity/Entity.js";
import Rapier from "../../../physics/rapier.js";
import { SingleSizeComponent } from "../../../../../shared/component/SingleSizeComponent.js";
import { PhysicsColliderComponent } from "../../component/PhysicsColliderComponent.js";
import { GroundCheckComponent } from "../../component/GroundedComponent.js";

export class GroundedCheckSystem {
  update(entities: Entity[], world: Rapier.World) {
    for (const entity of entities) {
      const groundedComponent = entity.getComponent(GroundCheckComponent);
      const bodyComponent = entity.getComponent(PhysicsBodyComponent);
      const positionComponent = entity.getComponent(PositionComponent);
      const colliderComponent = entity.getComponent(PhysicsColliderComponent);

      if (
        groundedComponent &&
        bodyComponent &&
        positionComponent &&
        colliderComponent
      ) {
        const sizeComponent = entity.getComponent(SingleSizeComponent);
        const size = sizeComponent?.size || 1.0;

        const ray = new Rapier.Ray(
          {
            x: positionComponent.x,
            y: positionComponent.y - 1,
            z: positionComponent.z,
          },
          {
            x: 0,
            y: -1,
            z: 0,
          }
        );
        const hit = world.castRay(
          ray,
          size * 2,
          false,
          undefined,
          undefined,
          colliderComponent.collider
        );
        groundedComponent.grounded = hit ? true : false;
      }
    }
  }
}
