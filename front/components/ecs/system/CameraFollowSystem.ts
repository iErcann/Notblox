import { Entity } from "@shared/entity/Entity";
import { FollowComponent } from "../component/FollowComponent";
import { PositionComponent } from "@shared/component/PositionComponent";
import * as THREE from "three";
import { Camera } from "@/components/camera";
import { InputMessage } from "@shared/network/client/input";

// Define systems
export class CameraFollowSystem {
  lastLookAtPosition: THREE.Vector3 | null = null;
  constructor(
    public positionLerpFactor = 0.55,
    public rotationLerpFactor = 0.25,
    private angle = 0,
    private rotationSpeed = 0.01 // Add a rotation speed
  ) {}

  update(dt: number, entities: Entity[], input: InputMessage) {
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

        console.log(input.cameraLeft);
        if (input.cameraLeft) this.angle -= this.rotationSpeed * dt;
        if (input.cameraRight) this.angle += this.rotationSpeed * dt;

        // camera.position.lerp(targetPosition, this.lerpFactor);

        // Rotate the camera around the player
        this.rotateCameraAroundPlayer(camera, targetPosition);
      }
    });
  }

  private rotateCameraAroundPlayer(
    camera: Camera,
    targetPosition: THREE.Vector3
  ) {
    // Calculate the new camera position based on the current angle
    const radius = camera.offset.z; // Adjust this value to control the camera distance from the player

    const cameraX = targetPosition.x + radius * Math.cos(this.angle);
    const cameraZ = targetPosition.z + radius * Math.sin(this.angle);

    camera.position.lerp(
      new THREE.Vector3(cameraX, targetPosition.y + camera.offset.y, cameraZ),
      this.positionLerpFactor
    );

    // Point the camera at the player
    const lookAtPosition = targetPosition.clone();

    if (!this.lastLookAtPosition) this.lastLookAtPosition = lookAtPosition;

    this.lastLookAtPosition.lerp(lookAtPosition, this.rotationLerpFactor);

    camera.lookAt(
      this.lastLookAtPosition.x,
      this.lastLookAtPosition.y,
      this.lastLookAtPosition.z
    );
  }
}
