import { InputComponent } from "../component/InputComponent.js";
import { PhysicsBodyComponent } from "../component/PhysicsBodyComponent.js";
import { Entity } from "../../../../shared/entity/Entity.js";
import Rapier from "../../physics/rapier.js";
import { PositionComponent } from "../../../../shared/component/PositionComponent.js";
import { PhysicsColliderComponent } from "../component/PhysicsColliderComponent.js";

export class MovementSystem {
  update(dt: number, entities: Entity[], world: Rapier.World): void {
    for (const entity of entities) {
      this.updateEntityMovement(dt, entity, world);
    }
  }

  updateEntityMovement(dt: number, entity: Entity, world: Rapier.World) {
    const inputComponent = entity.getComponent(InputComponent);
    const rigidBodyComponent = entity.getComponent(PhysicsBodyComponent);
    const colliderComponent = entity.getComponent(PhysicsColliderComponent);
    const positionComponent = entity.getComponent(PositionComponent);

    if (
      !inputComponent ||
      !rigidBodyComponent ||
      !positionComponent ||
      !colliderComponent
    ) {
      return; // Skip processing this entity if any required component is missing
    }

    const impulse = this.calculateImpulse(
      dt,
      inputComponent,
      rigidBodyComponent
    );
    this.handleJump(
      dt,
      inputComponent,
      positionComponent,
      world,
      colliderComponent,
      impulse
    );
    this.applyImpulse(dt, rigidBodyComponent, impulse);
  }

  calculateImpulse(
    dt: number,
    inputComponent: InputComponent,
    rigidBodyComponent: PhysicsBodyComponent
  ) {
    const currentLinVel = rigidBodyComponent.body.linvel();
    const speed = 0.8;
    const lookingYAngle = inputComponent.lookingYAngle;

    const impulse = new Rapier.Vector3(0, currentLinVel.y - 0.1 * dt, 0);

    if (inputComponent.up) {
      impulse.z += -speed * Math.sin(lookingYAngle);
      impulse.x += -speed * Math.cos(lookingYAngle);
    }
    if (inputComponent.down) {
      impulse.z += speed * Math.sin(lookingYAngle);
      impulse.x += speed * Math.cos(lookingYAngle);
    }
    if (inputComponent.right) {
      impulse.z += speed * Math.sin(lookingYAngle - Math.PI / 2);
      impulse.x += speed * Math.cos(lookingYAngle - Math.PI / 2);
    }
    if (inputComponent.left) {
      impulse.z += speed * Math.sin(lookingYAngle + Math.PI / 2);
      impulse.x += speed * Math.cos(lookingYAngle + Math.PI / 2);
    }

    impulse.x *= dt;
    impulse.z *= dt;

    return impulse;
  }

  handleJump(
    dt: number,
    inputComponent: InputComponent,
    positionComponent: PositionComponent,
    world: Rapier.World,
    colliderComponent: PhysicsColliderComponent,
    impulse: Rapier.Vector3
  ) {
    if (inputComponent.space) {
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

      if (hit != null) {
        impulse.y = 1.5 * dt;
      }
    }
  }

  applyImpulse(
    dt: number,
    rigidBodyComponent: PhysicsBodyComponent,
    impulse: Rapier.Vector3
  ) {
    rigidBodyComponent.body.setLinvel(impulse, true);
  }
}
