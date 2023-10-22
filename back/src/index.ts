import { EntityManager } from "../../shared/entity/EntityManager.js";
import { Cube } from "./ecs/entity/Cube.js";
// import { MovementSystem } from "./ecs/system/MovementSystem.js";
import { DestroyedComponent } from "../../shared/component/DestroyedComponent.js";
import { config } from "../../shared/network/config.js";
import { NetworkDataComponent } from "./ecs/component/NetworkDataComponent.js";
import { AnimationSystem } from "./ecs/system/AnimationSystem.js";
import { DestroySystem } from "./ecs/system/DestroySystem.js";
import { MovementSystem } from "./ecs/system/MovementSystem.js";
import { UpdateSizeSystem } from "./ecs/system/UpdateSizeSystem.js";
import { NetworkSystem } from "./ecs/system/network/NetworkSystem.js";
import { PhysicsSystem } from "./ecs/system/physics/PhysicsSystem.js";
import { SleepCheckSystem } from "./ecs/system/physics/SleepCheckSystem.js";
import { SyncPositionSystem } from "./ecs/system/physics/SyncPositionSystem.js";
import { SyncRotationSystem } from "./ecs/system/physics/SyncRotationSystem.js";
import { SyncSizeSystem } from "./ecs/system/physics/SyncSizeSystem.js";
import Rapier from "./physics/rapier.js";

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
const updateSizeSystem = new UpdateSizeSystem();

const animationSystem = new AnimationSystem();
const destroySystem = new DestroySystem();
const sleepCheckSystem = new SleepCheckSystem();
// const packet = new InputPacket(player.entity.id, true, false, false, false);
// inputProcessingSystem.receiveInputPacket(packet);

for (let i = 1; i < 16; i++) {
  new Cube(0, i, -i * 15, 3, i * 2, 3);
}

for (let i = 0; i < 5; i++) {
  new Cube(i * 10, 10, 0, 2, 2, 2);
}

setInterval(() => {
  const cube = new Cube(
    Math.random() * 10,
    Math.random() * 10 + 10,
    Math.random() * 10,
    1,
    1,
    1
  );
  setTimeout(() => {
    const destroyedComponent = new DestroyedComponent(cube.entity.id);
    const networkDataComponent = cube.entity.getComponent(NetworkDataComponent);
    if (networkDataComponent)
      networkDataComponent.addComponent(destroyedComponent);
    cube.entity.addComponent(destroyedComponent);
  }, 3000);
}, 3000);

// Create the ground
let groundColliderDesc = Rapier.ColliderDesc.cuboid(10000.0, 0.1, 10000.0);
physicsSystem.world.createCollider(groundColliderDesc);

console.log(`Detected tick rate : ${config.TICKRATE}`);
let lastUpdateTimestamp = Date.now();
function gameLoop() {
  setTimeout(gameLoop, 1000 / config.TICKRATE);
  const now = Date.now();
  const dt = now - lastUpdateTimestamp;

  movementSystem.update(dt, entities, physicsSystem.world);
  physicsSystem.update();

  syncRotationSystem.update(entities);
  syncPositionSystem.update(entities);
  animationSystem.update(entities);
  // TODO:  This make the rigidbody wake up so it will always be sent even if its supposd to sleep..
  syncSizeSystem.update(entities);
  networkSystem.update(entities);
  // TODO: Sleep system should reset all the other Component (like ColorComponent only need to be sent when its changed)
  // Check the order of things then so it doesnt reset after sending

  // IMPORTANT : Sleeping check should be at the end.
  // A SizeComponent inherits NetworkCom ponent that has updated to true by default
  // It is then sent to the players once
  // Then it becomes false
  // If it is modified, we changed the is sent.
  sleepCheckSystem.update(entities);

  // DestroyedSystem should be at the end because it destorys the entities
  // but we need to notify the clients with networkSystem.update
  destroySystem.update(entities, entityManager, physicsSystem.world);
  lastUpdateTimestamp = now;
}

gameLoop();
