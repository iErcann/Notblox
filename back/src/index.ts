import { Cube } from "./ecs/entity/Cube.js";
import { EntityManager } from "../../shared/entity/EntityManager.js";
import { InputProcessingSystem } from "./ecs/system/InputProcessingSystem.js";
// import { MovementSystem } from "./ecs/system/MovementSystem.js";
import { NetworkSystem } from "./ecs/system/network/NetworkSystem.js";
import { PhysicsSystem } from "./ecs/system/physics/PhysicsSystem.js";
import { SyncPositionSystem } from "./ecs/system/physics/SyncPositionSystem.js";
import { SyncRotationSystem } from "./ecs/system/physics/SyncRotationSystem.js";
import Rapier from "./physics/rapier.js";
import { config } from "../../shared/network/config.js";
import { MovementSystem } from "./ecs/system/MovementSystem.js";
import { SleepCheckSystem } from "./ecs/system/physics/SleepCheckSystem.js";

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
const sleepCheckSystem = new SleepCheckSystem();
// const packet = new InputPacket(player.entity.id, true, false, false, false);
// inputProcessingSystem.receiveInputPacket(packet);

for (let i = 1; i < 10; i++) {
  new Cube(Math.cos(i) * 25, i, Math.sin(i) * 25, 5);
}

setInterval(() => {
  new Cube(Math.random() * 10, Math.random() * 10, Math.random() * 10, 1);
}, 10000);

// Create the ground
let groundColliderDesc = Rapier.ColliderDesc.cuboid(100.0, 0.1, 100.0);
physicsSystem.world.createCollider(groundColliderDesc);

function gameLoop() {
  setTimeout(gameLoop, 1000 / config.TICKRATE);
  movementSystem.update(entities, physicsSystem.world);
  physicsSystem.update();

  syncRotationSystem.update(entities);
  syncPositionSystem.update(entities);

  networkSystem.update(entities);
  // TODO: Sleep system should reset all the other Component (like ColorComponent only need to be sent when its changed)
  // Check the order of things then so it doesnt reset after sending
  sleepCheckSystem.update(entities);
}

gameLoop();
