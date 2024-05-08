// AnimationSystem.js
import { PhysicsBodyComponent } from "../component/PhysicsBodyComponent.js";
import { InputComponent } from "../component/InputComponent.js";
import * as THREE from "three";
import { Entity } from "../../../../shared/entity/Entity.js";
import { StateComponent } from "../../../../shared/component/StateComponent.js";
import { SerializedStateType } from "../../../../shared/network/server/serialized.js";
import { PhysicsColliderComponent } from "../component/PhysicsColliderComponent.js";
import { PositionComponent } from "../../../../shared/component/PositionComponent.js";
import Rapier from "../../physics/rapier.js";

export class AnimationSystem {
  update(entities: Entity[], world: Rapier.World): void {
    entities.forEach((entity) => {
      const inputComponent = entity.getComponent(InputComponent);
      const rigidBodyComponent = entity.getComponent(PhysicsBodyComponent);
      const positionComponent = entity.getComponent(PositionComponent);
      const colliderComponent = entity.getComponent(PhysicsColliderComponent);
      const stateComponent = entity.getComponent(StateComponent);

      if (
        inputComponent &&
        rigidBodyComponent &&
        stateComponent &&
        positionComponent &&
        colliderComponent
      ) {
        const isGrounded = this.isGrounded(
          positionComponent,
          colliderComponent,
          world
        );

        this.updateState(inputComponent, stateComponent, isGrounded);

        if (stateComponent.state !== SerializedStateType.IDLE) {
          const { down, up, left, right } = inputComponent;
          const isInputDirectional = down || up || left || right;

          if (
            stateComponent.state !== SerializedStateType.FALL ||
            isInputDirectional
          ) {
            const quaternion = this.calculateRotation(inputComponent);
            this.rotatePlayer(rigidBodyComponent, quaternion);
          }
        }
      }
    });
  }

  isGrounded(
    positionComponent: PositionComponent,
    colliderComponent: PhysicsColliderComponent,
    world: Rapier.World
  ): boolean {
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
      1,
      false,
      undefined,
      undefined,
      colliderComponent.collider
    );
    return hit !== null;
  }

  updateState(
    inputComponent: InputComponent,
    stateComponent: StateComponent,
    isGrounded: boolean
  ): void {
    const { up, down, left, right } = inputComponent;
    let newState;

    if (!isGrounded) {
      newState = SerializedStateType.FALL;
    } else if (!up && !down && !left && !right) {
      newState = SerializedStateType.IDLE;
    } else {
      newState = SerializedStateType.RUN;
    }

    if (newState !== stateComponent.state) {
      stateComponent.state = newState;
      stateComponent.updated = true;
    }
  }

  calculateRotation(inputComponent: InputComponent): THREE.Quaternion {
    const { up, down, left, right, lookingYAngle } = inputComponent;
    let angle = 0;

    if (down) angle += Math.PI / 2;
    if (up) angle += -Math.PI / 2;
    if (right) angle += Math.PI;
    // if (left) angle += 0;
    if (up && left) angle += Math.PI / 4;
    if (up && right) angle += Math.PI - Math.PI / 4;
    if (down && left) angle += -Math.PI / 4;
    if (down && right) angle += Math.PI + Math.PI / 4;

    return new THREE.Quaternion().setFromAxisAngle(
      new THREE.Vector3(0, 1, 0),
      angle - lookingYAngle
    );
  }

  rotatePlayer(
    rigidBodyComponent: PhysicsBodyComponent,
    quaternion: THREE.Quaternion
  ): void {
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
