import { Entity } from "@shared/entity/Entity";
import { FollowComponent } from "../component/FollowComponent";
import { PositionComponent } from "@shared/component/PositionComponent";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// Define systems
export class CameraFollowSystem {
  constructor(public lerpFactor = 0.05) {}

  update(entities: Entity[]) {
    entities.forEach((entity) => {
      const positionComponent = entity.getComponent(PositionComponent);
      const followComponent = entity.getComponent(FollowComponent);

      if (followComponent && positionComponent) {
        // Adjust the position of the entity to follow the target
        const camera = followComponent.camera;
        const targetPosition = new THREE.Vector3(
          positionComponent.x,
          positionComponent.y,
          positionComponent.z
        );
        const orbitControler = camera.orbitControls;

        // Use lerp to smoothly move the camera towards the target position
        // camera.position.lerp(targetPosition, this.lerpFactor);
        orbitControler.target.lerp(targetPosition, this.lerpFactor);
        // orbitControler.object.position.copy(targetPosition);
      }
    });
  }
}
