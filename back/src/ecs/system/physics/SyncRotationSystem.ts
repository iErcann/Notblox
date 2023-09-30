import { PhysicsBodyComponent } from "../../component/PhysicsBodyComponent.js";
import { RotationComponent } from "../../component/RotationComponent.js";
import { Entity } from "../../entity/Entity.js";

export class SyncRotationSystem {
  update(entities: Entity[]) {
    entities.forEach((entity) => {
      const bodyComponent =
        entity.getComponent<PhysicsBodyComponent>(PhysicsBodyComponent);
      const rotationComponent =
        entity.getComponent<RotationComponent>(RotationComponent);

      if (bodyComponent && rotationComponent) {
        const rotation = bodyComponent.body.rotation();
        rotationComponent.x = rotation.x;
        rotationComponent.y = rotation.y;
        rotationComponent.z = rotation.z;
        rotationComponent.w = rotation.w;
      }
    });
  }
}
