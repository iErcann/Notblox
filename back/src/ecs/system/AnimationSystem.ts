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
        if (inputComponent.down && inputComponent.left) {
          const quaternion = new THREE.Quaternion().setFromAxisAngle(
            new THREE.Vector3(0, 1, 0),
            -Math.PI / 4
          );
          this.rotatePlayer(rigidBodyComponent, quaternion);
        } else if (inputComponent.down && inputComponent.right) {
          const quaternion = new THREE.Quaternion().setFromAxisAngle(
            new THREE.Vector3(0, 1, 0),
            Math.PI / 4
          );
          this.rotatePlayer(rigidBodyComponent, quaternion);
        } else if (inputComponent.up && inputComponent.left) {
          const quaternion = new THREE.Quaternion().setFromAxisAngle(
            new THREE.Vector3(0, 1, 0),
            Math.PI + Math.PI / 4
          );
          this.rotatePlayer(rigidBodyComponent, quaternion);
        } else if (inputComponent.up && inputComponent.right) {
          const quaternion = new THREE.Quaternion().setFromAxisAngle(
            new THREE.Vector3(0, 1, 0),
            Math.PI - Math.PI / 4
          );
          this.rotatePlayer(rigidBodyComponent, quaternion);
        } else if (inputComponent.up) {
          const quaternion = new THREE.Quaternion().setFromAxisAngle(
            new THREE.Vector3(0, 1, 0),
            Math.PI
          );
          this.rotatePlayer(rigidBodyComponent, quaternion);
        } else if (inputComponent.down) {
          const quaternion = new THREE.Quaternion().setFromAxisAngle(
            new THREE.Vector3(0, 1, 0),
            0
          );
          this.rotatePlayer(rigidBodyComponent, quaternion);
        } else if (inputComponent.left) {
          const quaternion = new THREE.Quaternion().setFromAxisAngle(
            new THREE.Vector3(0, 1, 0),
            -Math.PI / 2
          );
          this.rotatePlayer(rigidBodyComponent, quaternion);
        } else if (inputComponent.right) {
          const quaternion = new THREE.Quaternion().setFromAxisAngle(
            new THREE.Vector3(0, 1, 0),
            Math.PI / 2
          );
          this.rotatePlayer(rigidBodyComponent, quaternion);
        }
      }
    });
  }

  rotatePlayer(
    rigidBodyComponent: PhysicsBodyComponent,
    quaternion: THREE.Quaternion
  ) {
    console.log(quaternion);
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
