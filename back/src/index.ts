import 'dotenv/config'
import { EntityManager } from '../../shared/entity/EntityManager.js'
import { config } from '../../shared/network/config.js'
import { RandomizeComponent } from './ecs/component/RandomizeComponent.js'
import { Chat } from './ecs/entity/Chat.js'
import { MapWorld } from './ecs/entity/MapWorld.js'
import { Sphere } from './ecs/entity/Sphere.js'
import { AnimationSystem } from './ecs/system/AnimationSystem.js'
import { MovementSystem } from './ecs/system/MovementSystem.js'
import { RandomSizeSystem } from './ecs/system/RandomSizeSystem.js'
import { EventSystem } from './ecs/system/events/EventSystem.js'
import { TrimeshSystem } from './ecs/system/events/TrimeshSystem.js'
import { NetworkSystem } from './ecs/system/network/NetworkSystem.js'
import { BoundaryCheckSystem } from './ecs/system/physics/BoundaryCheckSystem.js'
import { GroundedCheckSystem } from './ecs/system/physics/GroundedCheckSystem.js'
import { PhysicsSystem } from './ecs/system/physics/PhysicsSystem.js'
import { SleepCheckSystem } from './ecs/system/physics/SleepCheckSystem.js'
import { SyncPositionSystem } from './ecs/system/physics/SyncPositionSystem.js'
import { SyncRotationSystem } from './ecs/system/physics/SyncRotationSystem.js'
import { NetworkComponent } from '../../shared/network/NetworkComponent.js'
import { Cube } from './ecs/entity/Cube.js'

const entityManager = EntityManager.getInstance()
const eventSystem = EventSystem.getInstance()
// TODO: Make it wait for the websocket server to start
const entities = entityManager.getAllEntities()

const physicsSystem = PhysicsSystem.getInstance()
const groundedCheckSystem = new GroundedCheckSystem()
const movementSystem = new MovementSystem()
const networkSystem = new NetworkSystem()

const syncPositionSystem = new SyncPositionSystem()
const syncRotationSystem = new SyncRotationSystem()

const trimeshSystem = new TrimeshSystem()

const animationSystem = new AnimationSystem()
const sleepCheckSystem = new SleepCheckSystem()
const randomSizeSystem = new RandomSizeSystem()
const boundaryCheckSystem = new BoundaryCheckSystem()

new MapWorld()
new Chat()

setTimeout(() => {
  const randomCube = new Cube(0, 10, 0, 1, 1, 1)
  randomCube.entity.addComponent(new RandomizeComponent(randomCube.entity.id))

  for (let i = 0; i < 3; i++) {
    const randomCube = new Cube(0, 10, 0, 1, 1, 1)
    randomCube.entity.addComponent(new RandomizeComponent(randomCube.entity.id))
  }

  new Sphere(0, 30, 0, 1)

  // Football field
  new Sphere(-276, 52, -355.76, 1)
  new Sphere(-276, 52, -355.76, 0.5)

  for (let i = 0; i < 3; i++) {
    const randomSphere = new Sphere(0, i * 30, 0, 1.2)
    randomSphere.entity.addComponent(new RandomizeComponent(randomCube.entity.id))
  }

  new Sphere(10, 30, 0, 4)
}, 1000)

// let movingCubeX = 0;
// setInterval(() => {
//   movingCubeX = (movingCubeX + 5) % 1000;
//   const big = new Cube(movingCubeX, 10, 0, 10, 10, 10);
//   setTimeout(() => {
//     eventSystem.addEvent(new EventDestroyed(big.entity.id));
//   }, 1000);
// }, 2000);

console.log(`Detected tick rate : ${config.SERVER_TICKRATE}`)
let lastUpdateTimestamp = Date.now()

// Either : setImmediate, setTimeout or setInterval
// Check https://github.com/timetocode/node-game-loop/issues/3#issuecomment-382130083

async function gameLoop() {
  setTimeout(gameLoop, 1000 / config.SERVER_TICKRATE)
  const now = Date.now()
  const dt = now - lastUpdateTimestamp

  await trimeshSystem.update(entities, physicsSystem.world)
  randomSizeSystem.update(entities)
  eventSystem.update(entities)

  groundedCheckSystem.update(entities, physicsSystem.world)
  movementSystem.update(dt, entities, physicsSystem.world)
  animationSystem.update(entities, physicsSystem.world)
  syncRotationSystem.update(entities)
  syncPositionSystem.update(entities)

  // TODO:  This make the rigidbody wake up so it will always be sent even if its supposed to sleep..
  boundaryCheckSystem.update(entities)
  networkSystem.update(entities)

  // TODO: Sleep system should reset all the other Component (like ColorComponent only need to be sent when its changed)
  // Check the order of things then so it doesnt reset after sending

  // IMPORTANT : Sleeping check should be at the end.
  // A SizeComponent inherits NetworkComponent that has updated to true by default
  // It is then sent to the players once
  // Then it becomes false
  // If it is modified, we changed the is sent.
  sleepCheckSystem.update(entities)
  physicsSystem.update()

  // Unsleepy components
  for (const entity of entities) {
    const components = entity.getAllComponents()
    for (const component of components) {
      if (component instanceof NetworkComponent) {
        if (component.updated) {
          console.log('FOUND', component)
        }
      }
    }
  }
  // Useful for DestroySystem
  eventSystem.afterUpdate(entities)
  lastUpdateTimestamp = now
}

try {
  gameLoop()
} catch (error) {
  console.error('Error in game loop:', error)
}
