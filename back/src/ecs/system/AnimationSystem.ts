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
        if (inputComponent.up) {
          this.rotatePlayer(rigidBodyComponent, { x: 0, y: 1, z: 0, w: 0 });
        } else if (inputComponent.down) {
          this.rotatePlayer(rigidBodyComponent, { x: 0, y: 0, z: 0, w: 1 });
        } else if (inputComponent.left) {
          this.rotatePlayer(rigidBodyComponent, {
            x: 0.0,
            y: -0.707,
            z: 0.0,
            w: 0.707,
          });
        } else if (inputComponent.right) {
          this.rotatePlayer(rigidBodyComponent, {
            x: 0.0,
            y: 0.707,
            z: 0.0,
            w: 0.707,
          });
        }
      }
    });
  }

  rotatePlayer(
    rigidBodyComponent: PhysicsBodyComponent,
    quaternion: Rapier.Quaternion
  ) {
    rigidBodyComponent.body.setRotation(quaternion, true);
  }
}
