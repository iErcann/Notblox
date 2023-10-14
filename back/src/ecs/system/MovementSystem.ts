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
        // Get the current linear velocity
        const currentLinVel = physicsBodyComponent.body.linvel();

        // Define the impulse values for each direction
        const impulse = new Rapier.Vector3(
          0,
          currentLinVel.y - 0.1, // Preserve the current Y velocity
          0
        );
        const speed = 100 / 2;

        // Handle input for moving up
        if (inputComponent.up) {
          impulse.z = -speed; // Adjust the vertical impulse value as needed (e.g., for jumping)
        }
        // Handle input for moving down (e.g., crouching)
        if (inputComponent.down) {
          impulse.z = speed; // Adjust the vertical impulse value as needed
        }
        // Handle input for moving left
        if (inputComponent.left) {
          impulse.x = -speed; // Adjust the horizontal impulse value as needed (e.g., for moving left)
        }
        // Handle input for moving right
        if (inputComponent.right) {
          impulse.x = speed; // Adjust the horizontal impulse value as needed (e.g., for moving right)
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
            impulse.y = 70;
          }
        }
        // Apply the accumulated impulse to the physics body
        physicsBodyComponent.body.setLinvel(impulse, true);
      }
    });
  }
}
