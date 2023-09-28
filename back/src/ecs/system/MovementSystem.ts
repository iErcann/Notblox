import { RigidBody } from "@dimforge/rapier3d-compat";
import { InputComponent } from "../component/InputComponent.js";
import { PhysicsBodyComponent } from "../component/PhysicsBodyComponent.js";
import { PositionComponent } from "../component/PositionComponent.js";
import { VelocityComponent } from "../component/VelocityComponent.js";
import { Entity } from "../entity/entity.js";
import Rapier from "../../physics/rapier.js";

export class MovementSystem {
  update(entities: Entity[]): void {
    entities.forEach((entity) => {
      const input = entity.getComponent<InputComponent>(InputComponent);

      const rigidBody =
        entity.getComponent<PhysicsBodyComponent>(PhysicsBodyComponent);

      if (input && rigidBody) {
        if (input.forward) {
          rigidBody.body.addForce(new Rapier.Vector3(1, 0, 0), false);
        }
        if (input.backward) {
          rigidBody.body.addForce(new Rapier.Vector3(-1, 0, 0), false);
        }
      }
    });
  }
}
