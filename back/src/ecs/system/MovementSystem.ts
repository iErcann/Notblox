import { InputComponent } from "../component/InputComponent.js";
import { PhysicsBodyComponent } from "../component/PhysicsBodyComponent.js";
import { Entity } from "../../../../shared/entity/Entity.js";
import Rapier from "../../physics/rapier.js";
import { PositionComponent } from "../../../../shared/component/PositionComponent.js";
import { PhysicsColliderComponent } from "../component/PhysicsColliderComponent.js";

export class MovementSystem {
  checkGround() {}

  update(entities: Entity[], world: Rapier.World): void {
    entities.forEach((entity) => {
      const inputComponent = entity.getComponent(InputComponent);
      const rigidBodyComponent = entity.getComponent(PhysicsBodyComponent);
      const colliderComponent = entity.getComponent(PhysicsColliderComponent);
      const positionComponent = entity.getComponent(PositionComponent);

      if (
        inputComponent &&
        rigidBodyComponent &&
        positionComponent &&
        colliderComponent
      ) {
        const physicsBodyComponent = entity.getComponent(PhysicsBodyComponent);
        if (!physicsBodyComponent) {
          console.error("Player doesn't have a rigidbody -> can't apply input");
          return;
        }

        // Define the impulse values for each direction
        const impulse = new Rapier.Vector3(
          0,
          rigidBodyComponent.body.linvel().y - 1,
          0
        );
        const speed = 100;

        // Calculate the movement direction based on the looking angle
        const lookingAngle = inputComponent.lookingAngle; // Get the looking angle

        console.log(lookingAngle);
        const moveDirection = new Rapier.Vector3(
          Math.sin(lookingAngle),
          0,
          Math.cos(lookingAngle)
        );

        if (inputComponent.up) {
          impulse.x = moveDirection.x * speed;
          impulse.z = -moveDirection.z * speed;
        }
        if (inputComponent.down) {
          impulse.x = -moveDirection.x * speed;
          impulse.z = moveDirection.z * speed;
        }
        if (inputComponent.left) {
          impulse.x = -Math.cos(lookingAngle) * speed;
          impulse.z = -Math.sin(lookingAngle) * speed;
        }
        if (inputComponent.right) {
          impulse.x = Math.cos(lookingAngle) * speed;
          impulse.z = Math.sin(lookingAngle) * speed;
        }
        if (inputComponent.space) {
          let ray = new Rapier.Ray(
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
          let hit = world.castRay(
            ray,
            1,
            false,
            undefined,
            undefined,
            colliderComponent.collider
          );
          console.log(hit);
          if (hit != null) {
            impulse.y = 50;
          }
        }

        // Apply the accumulated impulse to the physics body
        // const rotation = physicsBodyComponent.body.rotation();

        // physicsBodyComponent.body.setRotation(
        //   {
        //     x: rotation.x,
        //     y: rotation.y,
        //     z: rotation.z,
        //     w: rotation.w,
        //   },
        //   true
        // );
        physicsBodyComponent.body.setLinvel(impulse, true);
      }
    });
  }
}
