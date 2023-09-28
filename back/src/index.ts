import { Cube } from "./ecs/entity/Cube.js";
import { EntityManager } from "./ecs/entity/EntityManager.js";
import { Player } from "./ecs/entity/Player.js";
import { startWebSocket } from "./ecs/system/network/websocket.js";
import { InputProcessingSystem } from "./ecs/system/InputProcessingSystem.js";
import { MovementSystem } from "./ecs/system/MovementSystem.js";
import { PhysicsSystem } from "./ecs/system/physics/PhysicsSystem.js";
import { SyncPositionSystem } from "./ecs/system/physics/SyncPositionSystem.js";
import { InputPacket } from "./inputPacket.js";
import Rapier from "./physics/rapier.js";
import { NetworkSystem } from "./ecs/system/network/NetworkSystem.js";

// Example usage
// Create a system
const entityManager = EntityManager.getInstance();
const entities = entityManager.getAllEntities();
const physicsSystem = PhysicsSystem.getInstance();
const movementSystem = new MovementSystem();
const inputProcessingSystem = new InputProcessingSystem(entities);
const networkSystem = NetworkSystem.getInstance();

// Physics
const syncPositionSystem = new SyncPositionSystem();
const player = new Player(0, 10, 0);
const packet = new InputPacket(player.entity.id, true, false, false, false);
inputProcessingSystem.receiveInputPacket(packet);
const cube = new Cube(0, 10, 0, 0.5);

// Create the ground
let groundColliderDesc = Rapier.ColliderDesc.cuboid(10.0, 0.1, 10.0);
physicsSystem.world.createCollider(groundColliderDesc);

function gameLoop() {
  // for (const entity of entities) {
  //   const playerPosition =
  //     entity.getComponent<PositionComponent>(PositionComponent);
  //   if (playerPosition) {
  //     console.log(
  //       `Player's position is (${playerPosition.x}, ${playerPosition.y}, ${playerPosition.z})`
  //     );
  //   }
  // }
  movementSystem.update(entities);
  physicsSystem.update();
  syncPositionSystem.update(entities);
  networkSystem.serializeAll(entities);
  setTimeout(gameLoop, 16);
}

gameLoop();
startWebSocket(8001);
