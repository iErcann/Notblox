import "dotenv/config";
import { EntityManager } from "../../shared/entity/EntityManager.js";
import { Cube } from "./ecs/entity/Cube.js";
// import { MovementSystem } from "./ecs/system/MovementSystem.js";
import { EventDestroyedComponent } from "../../shared/component/events/EventDestroyedComponent.js";
import { config } from "../../shared/network/config.js";
import { NetworkDataComponent } from "./ecs/component/NetworkDataComponent.js";
import { AnimationSystem } from "./ecs/system/AnimationSystem.js";
import { MovementSystem } from "./ecs/system/MovementSystem.js";
import { DestroySystem } from "./ecs/system/events/DestroySystem.js";
import { SyncSizeSystem } from "./ecs/system/events/SyncSizeSystem.js";
import { NetworkSystem } from "./ecs/system/network/NetworkSystem.js";
import { PhysicsSystem } from "./ecs/system/physics/PhysicsSystem.js";
import { SleepCheckSystem } from "./ecs/system/physics/SleepCheckSystem.js";
import { SyncPositionSystem } from "./ecs/system/physics/SyncPositionSystem.js";
import { SyncRotationSystem } from "./ecs/system/physics/SyncRotationSystem.js";
import Rapier from "./physics/rapier.js";
import { EventSize } from "./ecs/component/events/EventSize.js";
import { RandomSizeSystem } from "./ecs/system/RandomSizeSystem.js";
import { SyncColorSystem } from "./ecs/system/events/SyncColorSystem.js";
import { TrimeshSystem } from "./ecs/system/events/TrimeshSystem.js";
import { MapWorld } from "./ecs/entity/MapWorld.js";
import { BoundaryCheckSystem } from "./ecs/system/physics/BoundaryCheckSystem.js";
import { Sphere } from "./ecs/entity/Sphere.js";
import { RandomizeComponent } from "./ecs/component/RandomizeComponent.js";
import { Chat } from "./ecs/entity/Chat.js";
import { EventSystem } from "./ecs/system/events/EventSystem.js";

const entityManager = EntityManager.getInstance();
const eventSystem = EventSystem.getInstance();
// TODO: Make it wait for the websocket server to start
const entities = entityManager.getAllEntities();

const physicsSystem = PhysicsSystem.getInstance();
const movementSystem = new MovementSystem();
const networkSystem = new NetworkSystem();

// Physics
const syncPositionSystem = new SyncPositionSystem();
const syncRotationSystem = new SyncRotationSystem();
const syncSizeSystem = new SyncSizeSystem();
const syncColorSystem = new SyncColorSystem();

const trimeshSystem = new TrimeshSystem();

const animationSystem = new AnimationSystem();
const destroySystem = new DestroySystem();
const sleepCheckSystem = new SleepCheckSystem();
const randomSizeSystem = new RandomSizeSystem();
const boundaryCheckSystem = new BoundaryCheckSystem();
// // new Cube(-50, 10, 0, 10, 10, 100);

// setInterval(() => {
//   const cube = new Cube(
//     Math.random() * 10,
//     Math.random() * 10 + 10,
//     Math.random() * 10,
//     1,
//     1,
//     1
//   );

//   if (Math.random() < 0.5) {
//     cube.entity.addComponent(
//       new EventSizeComponent(
//         cube.entity.id,
//         Math.random() * 5,
//         Math.random() * 5,
//         Math.random() * 5
//       )
//     );
//   }
//   setTimeout(() => {
//     const destroyedComponent = new EventDestroyedComponent(cube.entity.id);
//     const networkDataComponent = cube.entity.getComponent(NetworkDataComponent);
//     if (networkDataComponent)
//       networkDataComponent.addComponent(destroyedComponent);
//     cube.entity.addComponent(destroyedComponent);
//   }, 3000);
// }, 3000);

new MapWorld();
new Chat();

setTimeout(() => {
  // Walls
  /*   for (let i = 0; i < 10; i++) {
    for (let j = 1; j < 3; j++) {
      new Cube(i * 2, j * 2, 0, 1, 1, 1); // Front wall
      new Cube(i * 2, j * 2, 18, 1, 1, 1); // Back wall
      new Cube(0, j * 2, i * 2, 1, 1, 1); // Left wall
      new Cube(18, j * 2, i * 2, 1, 1, 1); // Right wall
    }
  }
 */
  new Cube(0, 10, 0, 1, 1, 1);
  new Cube(0, 10, 0, 1, 1, 1);
  const randomCube = new Cube(0, 10, 0, 1, 1, 1);
  randomCube.entity.addComponent(new RandomizeComponent(randomCube.entity.id));
  new Sphere(0, 30, 0, 1);
}, 1000);

// Create the ground
// let groundColliderDesc = Rapier.ColliderDesc.cuboid(10000.0, 0.1, 10000.0);
// physicsSystem.world.createCollider(groundColliderDesc);

console.log(`Detected tick rate : ${config.TICKRATE}`);
let lastUpdateTimestamp = Date.now();

async function gameLoop() {
  setTimeout(gameLoop, 1000 / config.TICKRATE);
  const now = Date.now();
  const dt = now - lastUpdateTimestamp;

  await trimeshSystem.update(entities, physicsSystem.world);
  movementSystem.update(dt, entities, physicsSystem.world);
  animationSystem.update(entities, physicsSystem.world);
  syncRotationSystem.update(entities);
  syncPositionSystem.update(entities);
  eventSystem.update(entities);
  // TODO:  This make the rigidbody wake up so it will always be sent even if its supposed to sleep..
  syncSizeSystem.update(entities);
  syncColorSystem.update(entities);
  randomSizeSystem.update(entities);
  boundaryCheckSystem.update(entities);
  networkSystem.update(entities);

  // TODO: Sleep system should reset all the other Component (like ColorComponent only need to be sent when its changed)
  // Check the order of things then so it doesnt reset after sending

  // IMPORTANT : Sleeping check should be at the end.
  // A SizeComponent inherits NetworkComponent that has updated to true by default
  // It is then sent to the players once
  // Then it becomes false
  // If it is modified, we changed the is sent.
  sleepCheckSystem.update(entities);

  physicsSystem.update();
  // DestroyedSystem should be at the end because it destroys the entities
  // but we need to notify the clients with networkSystem.update
  destroySystem.update(entities, entityManager, physicsSystem.world);
  lastUpdateTimestamp = now;
}

gameLoop();
