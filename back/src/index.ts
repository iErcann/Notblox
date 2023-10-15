import { EntityManager } from "../../shared/entity/EntityManager.js";
import { Cube } from "./ecs/entity/Cube.js";
// import { MovementSystem } from "./ecs/system/MovementSystem.js";
import { SizeComponent } from "../../shared/component/SizeComponent.js";
import { config } from "../../shared/network/config.js";
import { PhysicsBodyComponent } from "./ecs/component/PhysicsBodyComponent.js";
import { PhysicsColliderComponent } from "./ecs/component/PhysicsColliderComponent.js";
import { MovementSystem } from "./ecs/system/MovementSystem.js";
import { NetworkSystem } from "./ecs/system/network/NetworkSystem.js";
import { PhysicsSystem } from "./ecs/system/physics/PhysicsSystem.js";
import { SleepCheckSystem } from "./ecs/system/physics/SleepCheckSystem.js";
import { SyncPositionSystem } from "./ecs/system/physics/SyncPositionSystem.js";
import { SyncRotationSystem } from "./ecs/system/physics/SyncRotationSystem.js";
import { SyncSizeSystem } from "./ecs/system/physics/SyncSizeSystem.js";
import Rapier from "./physics/rapier.js";
import { AnimationSystem } from "./ecs/system/AnimationSystem.js";

// Create a system
const entityManager = EntityManager.getInstance();
// TODO: Make it wait for the websocket server to start
const entities = entityManager.getAllEntities();

const physicsSystem = PhysicsSystem.getInstance();
const movementSystem = new MovementSystem();
const networkSystem = NetworkSystem.getInstance();

// Physics
const syncPositionSystem = new SyncPositionSystem();
const syncRotationSystem = new SyncRotationSystem();
const syncSizeSystem = new SyncSizeSystem();
const animationSystem = new AnimationSystem();

const sleepCheckSystem = new SleepCheckSystem();
// const packet = new InputPacket(player.entity.id, true, false, false, false);
// inputProcessingSystem.receiveInputPacket(packet);

for (let i = 1; i < 10; i++) {
  new Cube(Math.cos(i) * 25, i / 2, Math.sin(i) * 50, 5, i, 10);
  new Cube(i * 10, i * 10, i, 1, 1, 1);
}

// setInterval(() => {
//   new Cube(
//     Math.random() * 10,
//     Math.random() * 10 + 10,
//     Math.random() * 10,
//     1,
//     1,
//     1
//   );
// }, 5000);

// Create the ground
let groundColliderDesc = Rapier.ColliderDesc.cuboid(10000.0, 0.1, 10000.0);
physicsSystem.world.createCollider(groundColliderDesc);

function gameLoop() {
  setTimeout(gameLoop, 1000 / config.TICKRATE);
  movementSystem.update(entities, physicsSystem.world);
  physicsSystem.update();

  syncRotationSystem.update(entities);
  syncPositionSystem.update(entities);
  animationSystem.update(entities);

  // TODO:  This make the rigidbody wake up so it will always be sent even if its supposd to sleep..
  // syncSizeSystem.update(entities);

  // for (const entity of entities) {
  //   const sizeComponent = entity.getComponent(SizeComponent);
  //   if (sizeComponent) {
  //     sizeComponent.width += 0.1;
  //     sizeComponent.height += 0.1;

  //     sizeComponent.isSent = true;
  //   }
  // }

  networkSystem.update(entities);
  // TODO: Sleep system should reset all the other Component (like ColorComponent only need to be sent when its changed)
  // Check the order of things then so it doesnt reset after sending

  // IMPORTANT : Sleeping check should be at the end.
  // A SizeComponent inherits NetworkComponent that has isSent to true by default
  // It is then sent to the players once
  // Then it becomes false
  // If it is modified, we changed the is sent.
  sleepCheckSystem.update(entities);
}

gameLoop();
