import { Entity } from "@shared/entity/Entity";
import { FollowComponent } from "../component/FollowComponent";
import { PositionComponent } from "@shared/component/PositionComponent";
import * as THREE from "three";

// Define systems
export class CameraFollowSystem {
  constructor(public lerpFactor = 0.1) {}

  update(entities: Entity[]) {
    entities.forEach((entity) => {
      const positionComponent = entity.getComponent(PositionComponent);
      const followComponent = entity.getComponent(FollowComponent);

      if (followComponent && positionComponent) {
        // Adjust the position of the entity to follow the target
        const camera = followComponent.camera;
        const targetPosition = new THREE.Vector3(
          positionComponent.x,
          positionComponent.y + 15,
          positionComponent.z + 10
        );

        // Use lerp to smoothly move the camera towards the target position
        camera.position.lerp(targetPosition, this.lerpFactor);
      }
    });
  }
}
