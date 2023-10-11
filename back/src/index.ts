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
// const packet = new InputPacket(player.entity.id, true, false, false, false);
// inputProcessingSystem.receiveInputPacket(packet);

new Cube(10, 5, 2, 3);
new Cube(3, 8, 1, 2);
new Cube(7, 2, 6, 4);
new Cube(9, 6, 5, 3);
new Cube(1, 1, 1, 2);
new Cube(4, 9, 3, 3);

// Create the ground
let groundColliderDesc = Rapier.ColliderDesc.cuboid(100.0, 0.1, 100.0);
physicsSystem.world.createCollider(groundColliderDesc);

function gameLoop() {
  setTimeout(gameLoop, 1000 / config.TICKRATE);
  movementSystem.update(entities);
  physicsSystem.update();

  syncRotationSystem.update(entities);
  syncPositionSystem.update(entities);
  networkSystem.update(entities);
}

gameLoop();
