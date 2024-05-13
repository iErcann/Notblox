import { PositionComponent } from "../../../../shared/component/PositionComponent.js";
import { RotationComponent } from "../../../../shared/component/RotationComponent.js";
import { Entity } from "../../../../shared/entity/Entity.js";
import { EntityManager } from "../../../../shared/entity/EntityManager.js";
import {
  SerializedEntityType,
  SerializedStateType,
} from "../../../../shared/network/server/serialized.js";
import Rapier from "../../physics/rapier.js";
import { InputComponent } from "../component/InputComponent.js";
import { NetworkDataComponent } from "../component/NetworkDataComponent.js";
import { PhysicsBodyComponent } from "../component/PhysicsBodyComponent.js";
import { PhysicsColliderComponent } from "../component/PhysicsColliderComponent.js";
import { WebSocketComponent } from "../component/WebsocketComponent.js";
import { PhysicsSystem } from "../system/physics/PhysicsSystem.js";
import { StateComponent } from "../../../../shared/component/StateComponent.js";
import { EventSystem } from "../system/events/EventSystem.js";
import { EventChatMessage } from "../component/events/EventChatMessage.js";
import { PlayerComponent } from "../component/tag/PlayerComponent.js";
import { SingleSizeComponent } from "../../../../shared/component/SingleSizeComponent.js";
import { GroundCheckComponent } from "../component/GroundedComponent.js";

export class Player {
  entity: Entity;

  constructor(
    ws: WebSocket,
    initialX: number,
    initialY: number,
    initialZ: number
  ) {
    const world = PhysicsSystem.getInstance().world;
    this.entity = EntityManager.getInstance().createEntity(
      SerializedEntityType.PLAYER
    );

    const sizeComponent = new SingleSizeComponent(
      this.entity.id,
      1 + Math.random()
    );
    this.entity.addComponent(sizeComponent);

    this.entity.addComponent(new WebSocketComponent(this.entity.id, ws));

    this.entity.addComponent(new PlayerComponent(this.entity.id));

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

    this.entity.addComponent(new InputComponent(this.entity.id));

    this.entity.addComponent(new GroundCheckComponent(this.entity.id));

    const stateComponent = new StateComponent(
      this.entity.id,
      SerializedStateType.IDLE
    );
    this.entity.addComponent(stateComponent);

    this.createRigidBody(world);
    this.createCollider(world);

    // Network
    const networkDataComponent = new NetworkDataComponent(
      this.entity.id,
      this.entity.type,
      [positionComponent, rotationComponent, sizeComponent, stateComponent]
    );
    this.entity.addComponent(networkDataComponent);

    EventSystem.getInstance().addEvent(
      new EventChatMessage(
        this.entity.id,
        "🖥️ [SERVER]",
        `Player ${this.entity.id} joined at ${new Date().toLocaleString()}`
      )
    );
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
    rigidBodyDesc.lockRotations();
    let rigidBody = world.createRigidBody(rigidBodyDesc);
    rigidBody.setTranslation(new Rapier.Vector3(x, y, z), false);

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

    const sizeComponent = this.entity.getComponent(SingleSizeComponent);
    if (!sizeComponent) {
      console.error("Size component doesn't exist on Player.");
      return;
    }

    let colliderDesc = Rapier.ColliderDesc.capsule(
      sizeComponent.size / 2,
      sizeComponent.size
    );
    // Adjust the friction to control sliding
    // colliderDesc.setFriction(0.2); // Adjust the value as needed

    // Set the friction combine rule to control how friction is combined with other contacts
    colliderDesc.setFrictionCombineRule(Rapier.CoefficientCombineRule.Max);

    // Set restitution to control how bouncy the player is when colliding with surfaces
    // colliderDesc.setRestitution(0.0); // Adjust the value as needed

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
}
