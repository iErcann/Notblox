import { PositionComponent } from "../../../../shared/component/PositionComponent.js";
import { RotationComponent } from "../../../../shared/component/RotationComponent.js";
import { Entity } from "../../../../shared/entity/Entity.js";
import { SerializedEntityType } from "../../../../shared/network/server/serialized.js";
import Rapier from "../../physics/rapier.js";
import { NetworkDataComponent } from "../component/NetworkDataComponent.js";
import { PhysicsBodyComponent } from "../component/PhysicsBodyComponent.js";
import { PhysicsColliderComponent } from "../component/PhysicsColliderComponent.js";
import { PhysicsSystem } from "../system/physics/PhysicsSystem.js";
import { EntityManager } from "./EntityManager.js";

export class Cube {
  entity: Entity;

  constructor(x: number, y: number, z: number, size: number) {
    this.entity = EntityManager.getInstance().createEntity(
      SerializedEntityType.CUBE
    );
    const world = PhysicsSystem.getInstance().world;

    // Adding a PositionComponent with initial position
    const positionComponent = new PositionComponent(this.entity.id, x, y, z);
    this.entity.addComponent(positionComponent);

    const rotationComponent = new RotationComponent(this.entity.id, 0, 0, 0, 0);
    this.entity.addComponent(rotationComponent);

    this.createRigidBody(world);
    this.createCollider(world, size);

    this.entity.addComponent(
      new NetworkDataComponent(this.entity.id, this.entity.type, [
        positionComponent,
        rotationComponent,
      ])
    );
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
  createCollider(world: Rapier.World, size: number) {
    // Collider
    const rigidBodyComponent =
      this.entity.getComponent<PhysicsBodyComponent>(PhysicsBodyComponent);

    if (!rigidBodyComponent) {
      console.error("Body doesn't exist on Cube.");
      return;
    }

    let colliderDesc = Rapier.ColliderDesc.cuboid(size, size, size);
    let collider = world.createCollider(colliderDesc, rigidBodyComponent.body);

    this.entity.addComponent(
      new PhysicsColliderComponent(this.entity.id, collider)
    );
  }
}
