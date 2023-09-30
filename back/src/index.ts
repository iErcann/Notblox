import { Cube } from "./ecs/entity/Cube.js";
import { EntityManager } from "./ecs/entity/EntityManager.js";
import { InputProcessingSystem } from "./ecs/system/InputProcessingSystem.js";
import { MovementSystem } from "./ecs/system/MovementSystem.js";
import { PhysicsSystem } from "./ecs/system/physics/PhysicsSystem.js";
import { SyncPositionSystem } from "./ecs/system/physics/SyncPositionSystem.js";
import Rapier from "./physics/rapier.js";
import { NetworkSystem } from "./ecs/system/network/NetworkSystem.js";
import { WebsocketSystem } from "./ecs/system/network/WebsocketSystem.js";
import { SyncRotationSystem } from "./ecs/system/physics/SyncRotationSystem.js";

// Create a system
const entityManager = EntityManager.getInstance();
// TODO: Make it wait for the websocket server to start
const entities = entityManager.getAllEntities();

const physicsSystem = PhysicsSystem.getInstance();
const movementSystem = new MovementSystem();
const inputProcessingSystem = new InputProcessingSystem(entities);
const networkSystem = NetworkSystem.getInstance();

// Physics
const syncPositionSystem = new SyncPositionSystem();
const syncRotationSystem = new SyncRotationSystem();
// const player = new Player(0, 10, 0);
// const packet = new InputPacket(player.entity.id, true, false, false, false);
// inputProcessingSystem.receiveInputPacket(packet);
new Cube(10, 10, 10, 0.5);
new Cube(0, 10, 0, 0.5);
new Cube(0, 10, 0, 0.5);
new Cube(0, 10, 0, 0.5);
new Cube(0, 10, 0, 0.5);
new Cube(0, 10, 0, 0.5);
new Cube(10, 10, 10, 0.5);
new Cube(0, 10, 0, 0.5);
new Cube(0, 10, 0, 0.5);
new Cube(0, 10, 0, 0.5);
new Cube(0, 10, 0, 0.5);
new Cube(0, 10, 0, 0.5);
new Cube(10, 10, 10, 0.5);
new Cube(0, 10, 0, 0.5);
new Cube(0, 10, 0, 0.5);
new Cube(0, 10, 0, 0.5);
new Cube(0, 10, 0, 0.5);
new Cube(0, 10, 0, 0.5);
new Cube(10, 10, 10, 0.5);
new Cube(0, 10, 0, 0.5);
new Cube(0, 10, 0, 0.5);
new Cube(0, 10, 0, 0.5);
new Cube(0, 10, 0, 0.5);
new Cube(0, 10, 0, 0.5);
new Cube(10, 10, 10, 0.5);
new Cube(0, 10, 0, 0.5);
new Cube(0, 10, 0, 0.5);
new Cube(0, 10, 0, 0.5);
new Cube(0, 10, 0, 0.5);
new Cube(0, 10, 0, 0.5);
new Cube(10, 10, 10, 0.5);
new Cube(0, 10, 0, 0.5);
new Cube(0, 10, 0, 0.5);
new Cube(0, 10, 0, 0.5);
new Cube(0, 10, 0, 0.5);
new Cube(0, 10, 0, 0.5);
new Cube(10, 10, 10, 0.5);
new Cube(0, 10, 0, 0.5);
new Cube(0, 10, 0, 0.5);
new Cube(0, 10, 0, 0.5);
new Cube(0, 10, 0, 0.5);
new Cube(0, 10, 0, 0.5);
new Cube(10, 10, 10, 0.5);
new Cube(0, 10, 0, 0.5);
new Cube(0, 10, 0, 0.5);
new Cube(0, 10, 0, 0.5);
new Cube(0, 10, 0, 0.5);
new Cube(0, 10, 0, 0.5);

// Create the ground
let groundColliderDesc = Rapier.ColliderDesc.cuboid(10.0, 0.1, 10.0);
physicsSystem.world.createCollider(groundColliderDesc);

function gameLoop() {
  movementSystem.update(entities);
  physicsSystem.update();

  syncRotationSystem.update(entities);
  syncPositionSystem.update(entities);
  networkSystem.update(entities);
  setTimeout(gameLoop, 1000 / 20);
}

gameLoop();
