import { PositionComponent } from "../../../../shared/component/PositionComponent.js";
import { RotationComponent } from "../../../../shared/component/RotationComponent.js";
import { Entity } from "../../../../shared/entity/Entity.js";
import { EntityManager } from "../../../../shared/entity/EntityManager.js";
import { SerializedEntityType } from "../../../../shared/network/server/serialized.js";
import Rapier from "../../physics/rapier.js";
import { CharacterControllerComponent } from "../component/CharacterControllerComponent.js";
import { InputComponent } from "../component/InputComponent.js";
import { NetworkDataComponent } from "../component/NetworkDataComponent.js";
import { PhysicsBodyComponent } from "../component/PhysicsBodyComponent.js";
import { PhysicsColliderComponent } from "../component/PhysicsColliderComponent.js";
import { VelocityComponent } from "../component/VelocityComponent.js";
import { WebSocketComponent } from "../component/WebsocketComponent.js";
import { PhysicsSystem } from "../system/physics/PhysicsSystem.js";

export class Player {
  entity: Entity;

  constructor(
    ws: WebSocket,
    initialX: number,
    initialY: number,
    initialZ: number
  ) {
    console.log("New player created !");
    const world = PhysicsSystem.getInstance().world;
    this.entity = EntityManager.getInstance().createEntity(
      SerializedEntityType.PLAYER
    );

    this.entity.addComponent(new WebSocketComponent(this.entity.id, ws));

    // Adding a PositionComponent with initial position
    const positionComponent = new PositionComponent(
      this.entity.id,
      initialX,
      initialY,
      initialZ
    );
    this.entity.addComponent(positionComponent);

    const rotationComponent = new RotationComponent(this.entity.id, 0, 1, 2);
    this.entity.addComponent(rotationComponent);

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

    // Network
    const networkDataComponent = new NetworkDataComponent(
      this.entity.id,
      this.entity.type,
      [positionComponent, rotationComponent]
    );

    this.entity.addComponent(networkDataComponent);
  }

  getPosition() {
    return this.entity.getComponent(PositionComponent)!;
  }
  createRigidBody(world: Rapier.World) {
    const { x, y, z } = this.getPosition();
    // Rigidbody
    let rigidBodyDesc = Rapier.RigidBodyDesc.dynamic();
    rigidBodyDesc.setLinearDamping(0.1);
    rigidBodyDesc.setCcdEnabled(true);

    let rigidBody = world.createRigidBody(rigidBodyDesc);
    rigidBody.setTranslation(new Rapier.Vector3(x, y, z), false);
    rigidBody.lockRotations(true, false);

    this.entity.addComponent(
      new PhysicsBodyComponent(this.entity.id, rigidBody)
    );
  }
  createCollider(world: Rapier.World) {
    // Collider
    const rigidBodyComponent = this.entity.getComponent(PhysicsBodyComponent);

    if (!rigidBodyComponent) {
      console.error("Body doesn't exist on Player.");
      return;
    }

    let colliderDesc = Rapier.ColliderDesc.capsule(0.5, 1);

    // Adjust the friction to control sliding
    colliderDesc.setFriction(0.2); // Adjust the value as needed

    // Set the friction combine rule to control how friction is combined with other contacts
    colliderDesc.setFrictionCombineRule(Rapier.CoefficientCombineRule.Max);

    // Set restitution to control how bouncy the player is when colliding with surfaces
    colliderDesc.setRestitution(0.0); // Adjust the value as needed

    // Set the restitution combine rule to control how restitution is combined with other contacts
    colliderDesc.setRestitutionCombineRule(Rapier.CoefficientCombineRule.Max);

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
    const controller = this.entity.getComponent(CharacterControllerComponent);
    if (controller) {
      controller.desiredTranslation = desiredTranslation;
    }
  }
}
