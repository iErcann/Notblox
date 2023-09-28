import Rapier from "../../physics/rapier.js";
import { CharacterControllerComponent } from "../component/CharacterControllerComponent.js";
import { InputComponent } from "../component/InputComponent.js";
import { PhysicsBodyComponent } from "../component/PhysicsBodyComponent.js";
import { PhysicsColliderComponent } from "../component/PhysicsColliderComponent.js";
import { PositionComponent } from "../component/PositionComponent.js";
import { VelocityComponent } from "../component/VelocityComponent.js";
import { PhysicsSystem } from "../system/PhysicsSystem.js";
import { EntityManager } from "./EntityManager.js";
import { Entity } from "./entity.js";

export class Player {
  entity: Entity;

  constructor(initialX: number, initialY: number, initialZ: number) {
    this.entity = EntityManager.getInstance().createEntity();
    const world = PhysicsSystem.getInstance().world;

    // Adding a PositionComponent with initial position
    this.entity.addComponent(
      new PositionComponent(this.entity.id, initialX, initialY, initialZ)
    );
    // Adding a VelocityComponent with initial velocity as 0
    this.entity.addComponent(new VelocityComponent(this.entity.id, 0, 0));

    // Adding an InputComponent to handle player inputs
    this.entity.addComponent(new InputComponent(this.entity.id));

    // TODO: Retest this
    // this.entity.addComponent(
    //   new CharacterControllerComponent(this.entity.id, world)
    // );

    this.createRigidBody(world);
    this.createCollider(world);
  }
  getPosition() {
    return this.entity.getComponent<PositionComponent>(PositionComponent)!;
  }
  createRigidBody(world: Rapier.World) {
    const { x, y, z } = this.getPosition();
    // Rigidbody
    let rigidBodyDesc = Rapier.RigidBodyDesc.dynamic();
    let rigidBody = world.createRigidBody(rigidBodyDesc);
    rigidBody.setTranslation(new Rapier.Vector3(x, y, z), false);

    this.entity.addComponent(
      new PhysicsBodyComponent(this.entity.id, rigidBody)
    );
  }
  createCollider(world: Rapier.World) {
    // Collider
    const rigidBodyComponent =
      this.entity.getComponent<PhysicsBodyComponent>(PhysicsBodyComponent);

    if (!rigidBodyComponent) {
      console.error("Body doesn't exist on Player.");
      return;
    }

    let colliderDesc = Rapier.ColliderDesc.cuboid(0.5, 0.5, 0.5);
    let collider = world.createCollider(colliderDesc, rigidBodyComponent.body);

    this.entity.addComponent(
      new PhysicsColliderComponent(this.entity.id, collider)
    );
  }
  // Getter for the underlying entity
  getEntity(): Entity {
    return this.entity;
  }
  move(desiredTranslation: any) {
    const controller = this.entity.getComponent<CharacterControllerComponent>(
      CharacterControllerComponent
    );
    if (controller) {
      controller.desiredTranslation = desiredTranslation;
    }
  }
}
