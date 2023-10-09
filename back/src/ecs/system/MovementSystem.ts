import { InputComponent } from "../component/InputComponent.js";
import { PhysicsBodyComponent } from "../component/PhysicsBodyComponent.js";
import { Entity } from "../../../../shared/entity/Entity.js";
import Rapier from "../../physics/rapier.js";

export class MovementSystem {
  update(entities: Entity[]): void {
    entities.forEach((entity) => {
      const input = entity.getComponent<InputComponent>(InputComponent);

      const rigidBody =
        entity.getComponent<PhysicsBodyComponent>(PhysicsBodyComponent);

      if (input && rigidBody) {
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
          currentLinVel.y, // Preserve the current Y velocity
          0
        );
        const speed = 60 / 2;

        // Handle input for moving up
        if (input.up) {
          impulse.z = -speed; // Adjust the vertical impulse value as needed (e.g., for jumping)
        }
        // Handle input for moving down (e.g., crouching)
        if (input.down) {
          impulse.z = speed; // Adjust the vertical impulse value as needed
        }
        // Handle input for moving left
        if (input.left) {
          impulse.x = -speed; // Adjust the horizontal impulse value as needed (e.g., for moving left)
        }
        // Handle input for moving right
        if (input.right) {
          impulse.x = speed; // Adjust the horizontal impulse value as needed (e.g., for moving right)
        }
        if (input.space) {
          impulse.y = speed / 4;
        }
        // Apply the accumulated impulse to the physics body
        physicsBodyComponent.body.setLinvel(impulse, true);
      }
    });
  }
}
