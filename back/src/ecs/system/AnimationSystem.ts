// AnimationSystem.js
import { PhysicsBodyComponent } from "../component/PhysicsBodyComponent.js";
import { InputComponent } from "../component/InputComponent.js";
import * as THREE from "three";
import { Entity } from "../../../../shared/entity/Entity.js";
import { StateComponent } from "../../../../shared/component/StateComponent.js";
import { SerializedStateType } from "../../../../shared/network/server/serialized.js";

export class AnimationSystem {
  update(entities: Entity[]): void {
    entities.forEach((entity) => {
      const inputComponent = entity.getComponent(InputComponent);
      const rigidBodyComponent = entity.getComponent(PhysicsBodyComponent);
      const stateComponent = entity.getComponent(StateComponent);

      if (inputComponent && rigidBodyComponent && stateComponent) {
        const { up, down, left, right, lookingYAngle } = inputComponent;

        // If no input is received
        if (!up && !down && !left && !right) {
          // Update the state to idle (only once to avoid spamming the network)
          if (stateComponent.state !== SerializedStateType.IDLE) {
            stateComponent.state = SerializedStateType.IDLE;
            // Will be set to false by the SleepCheckSystem after being sent once
            stateComponent.updated = true;
          }
          // Return early to avoid rotating the player
          return;
        }

        if (stateComponent.state != SerializedStateType.RUN) {
          stateComponent.state = SerializedStateType.RUN;
          stateComponent.updated = true;
        }

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
