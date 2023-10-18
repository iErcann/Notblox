// AnimationSystem.js
import Rapier from "../../physics/rapier.js";
import { RigidBody } from "@dimforge/rapier3d-compat";
import { PhysicsBodyComponent } from "../component/PhysicsBodyComponent.js";
import { InputComponent } from "../component/InputComponent.js";
import { Entity } from "shared/entity/Entity.js";
import * as THREE from "three";

export class AnimationSystem {
  update(entities: Entity[]): void {
    entities.forEach((entity) => {
      const inputComponent = entity.getComponent(InputComponent);
      const rigidBodyComponent = entity.getComponent(PhysicsBodyComponent);

      if (inputComponent && rigidBodyComponent) {
        const { up, down, left, right, lookingYAngle } = inputComponent;

        // Define the quaternion rotation angle based on input
        let angle = 0;
        if (down) angle += Math.PI / 2;
        if (up) angle += -Math.PI / 2;
        if (right) angle += Math.PI;
        if (left) angle += 0;

        if (up && left) angle += Math.PI / 4;
        if (up && right) angle += Math.PI - Math.PI / 4;
        if (down && left) angle += -Math.PI / 4;
        if (down && right) angle += Math.PI + Math.PI / 4;

        // Create the quaternion
        const quaternion = new THREE.Quaternion().setFromAxisAngle(
          new THREE.Vector3(0, 1, 0),
          angle - lookingYAngle
        );

        // Rotate the player
        this.rotatePlayer(rigidBodyComponent, quaternion);
      }
    });
  }
  rotatePlayer(
    rigidBodyComponent: PhysicsBodyComponent,
    quaternion: THREE.Quaternion
  ) {
    rigidBodyComponent.body.setRotation(
      {
        x: quaternion.x,
        y: quaternion.y,
        z: quaternion.z,
        w: quaternion.w,
      },
      true
    );
  }
}
