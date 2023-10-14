import { Entity } from "@shared/entity/Entity";
import { FollowComponent } from "../component/FollowComponent";
import { PositionComponent } from "@shared/component/PositionComponent";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { InputManager } from "@/components/InputManager";

// Define systems
export class CameraFollowSystem {
  constructor(public lerpFactor = 0.2) {}

  update(entities: Entity[], inputManager: InputManager) {
    entities.forEach((entity) => {
      const positionComponent = entity.getComponent(PositionComponent);
      const followComponent = entity.getComponent(FollowComponent);

      if (followComponent && positionComponent) {
        // Adjust the position of the entity to follow the target
        const camera = followComponent.camera;
        const targetPosition = new THREE.Vector3(
          positionComponent.x,
          positionComponent.y + 2,
          positionComponent.z
        );
        const orbitControler = camera.orbitControls;
        const cameraQuaternion = camera.quaternion;

        // Convert the quaternion to Euler angles
        const euler = new THREE.Euler().setFromQuaternion(
          cameraQuaternion,
          "YXZ"
        );

        // Access the Y (yaw) rotation in radians
        const cameraYRotation = euler.y;

        inputManager.inputState.lookingAngle = -cameraYRotation;

        // Use lerp to smoothly move the camera towards the target position
        // camera.position.lerp(targetPosition, this.lerpFactor);
        orbitControler.target.lerp(targetPosition, this.lerpFactor);
      }
    });
  }
}
