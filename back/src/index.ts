import 'dotenv/config'

import { EntityManager } from '../../shared/system/EntityManager.js'
import { config } from '../../shared/network/config.js'
import { BaseEventSystem } from '../../shared/system/EventSystem.js'

import { RandomizeComponent } from './ecs/component/RandomizeComponent.js'
import { Chat } from './ecs/entity/Chat.js'
import { Cube } from './ecs/entity/Cube.js'
import { MapWorld } from './ecs/entity/MapWorld.js'
import { Sphere } from './ecs/entity/Sphere.js'
import { AnimationSystem } from './ecs/system/AnimationSystem.js'
import { MovementSystem } from './ecs/system/MovementSystem.js'
import { RandomizeSystem } from './ecs/system/RandomizeSystem.js'
import { ChatEventSystem } from './ecs/system/events/ChatEventSystem.js'
import { ColorEventSystem } from './ecs/system/events/ColorEventSystem.js'
import { DestroyEventSystem } from './ecs/system/events/DestroyEventSystem.js'
import { SingleSizeEventSystem } from './ecs/system/events/SingleSizeEventSystem.js'
import { SizeEventSystem } from './ecs/system/events/SizeEventSystem.js'
import { NetworkSystem } from './ecs/system/network/NetworkSystem.js'
import { BoundaryCheckSystem } from './ecs/system/physics/BoundaryCheckSystem.js'
import { BoxColliderSystem } from './ecs/system/physics/BoxColliderSystem.js'
import { CapsuleColliderSystem } from './ecs/system/physics/CapsuleColliderSystem.js'
import { DynamicRigidBodySystem } from './ecs/system/physics/DynamicRigidBodySystem.js'
import { GroundedCheckSystem } from './ecs/system/physics/GroundedCheckSystem.js'
import { KinematicRigidBodySystem } from './ecs/system/physics/KinematicRigidBodySystem.js'
import { LockRotationSystem } from './ecs/system/physics/LockRotationSystem.js'
import { PhysicsSystem } from './ecs/system/physics/PhysicsSystem.js'
import { SleepCheckSystem } from './ecs/system/physics/SleepCheckSystem.js'
import { SphereColliderSystem } from './ecs/system/physics/SphereColliderSystem.js'
import { SyncPositionSystem } from './ecs/system/physics/SyncPositionSystem.js'
import { SyncRotationSystem } from './ecs/system/physics/SyncRotationSystem.js'
import { TrimeshColliderSystem } from './ecs/system/physics/TrimeshColliderSystem.js'
// import { EntityDestroyedEvent } from '../../shared/component/events/EntityDestroyedEvent.js'

// TODO: Make it wait for the websocket server to start
const eventSystem = BaseEventSystem.getInstance()
const entityManager = EntityManager.getInstance()
const entities = entityManager.getAllEntities()

// Physics bodies
const kinematicPhysicsBodySystem = new KinematicRigidBodySystem()
const rigidPhysicsBodySystem = new DynamicRigidBodySystem()
// Physics colliders
const trimeshColliderSystem = new TrimeshColliderSystem()
const boxColliderSystem = new BoxColliderSystem()
const capsuleColliderSystem = new CapsuleColliderSystem()
const sphereColliderSystem = new SphereColliderSystem()

const physicsSystem = PhysicsSystem.getInstance()
const groundedCheckSystem = new GroundedCheckSystem()
const lockedRotationSystem = new LockRotationSystem()

const colorEventSystem = new ColorEventSystem()
const singleSizeEventSystem = new SingleSizeEventSystem()
const sizeEventSystem = new SizeEventSystem()
const syncPositionSystem = new SyncPositionSystem()
const syncRotationSystem = new SyncRotationSystem()
const chatSystem = new ChatEventSystem()
const destroyEventSystem = new DestroyEventSystem()

const movementSystem = new MovementSystem()
const networkSystem = new NetworkSystem()

const animationSystem = new AnimationSystem()
const sleepCheckSystem = new SleepCheckSystem()
const randomizeSystem = new RandomizeSystem()
const boundaryCheckSystem = new BoundaryCheckSystem()

new MapWorld()
new Chat()

function runTestEntities() {
  setTimeout(() => {
    const randomCube = new Cube(0, 50, 0, 1, 1, 1)
    randomCube.entity.addComponent(new RandomizeComponent(randomCube.entity.id))
    for (let i = 1; i < 5; i++) {
      const c2 = new Cube(0, 5, 5 * i, i / 5, i / 5, i / 5)
      c2.entity.addComponent(new RandomizeComponent(c2.entity.id))
    }
    new Sphere(0, 30, 0, 1)
    for (let i = 1; i < 1; i++) {
      const s = new Sphere(0, i * 30, 0, 1.2)
      s.entity.addComponent(new RandomizeComponent(s.entity.id))
    }
    new Sphere(10, 30, 0, 4)
  }, 1000)
  // setInterval(() => {
  //   new Cube(0, 10, 0, Math.random(), Math.random(), Math.random())
  // }, 1000)

  // let movingCubeZ = 0
  // setInterval(() => {
  //   movingCubeZ = (movingCubeZ + 5) % 1000
  //   const big = new Cube(0, 50, movingCubeZ, 2, 2, 2)
  //   setTimeout(() => {
  //     BaseEventSystem.addNetworkEvent(new EntityDestroyedEvent(big.entity.id))
  //   }, 1000)
  // }, 2000)
}
runTestEntities()
console.log(`Detected tick rate : ${config.SERVER_TICKRATE}`)
let lastUpdateTimestamp = Date.now()

async function gameLoop() {
  setTimeout(gameLoop, 1000 / config.SERVER_TICKRATE)
  const now = Date.now()
  const dt = now - lastUpdateTimestamp

  destroyEventSystem.update(entities)

  // Create the bodies first.
  kinematicPhysicsBodySystem.update(physicsSystem.world)
  rigidPhysicsBodySystem.update(entities, physicsSystem.world)
  // Then handle the colliders
  trimeshColliderSystem.update(entities, physicsSystem.world)
  boxColliderSystem.update(entities, physicsSystem.world)
  capsuleColliderSystem.update(entities, physicsSystem.world)
  sphereColliderSystem.update(entities, physicsSystem.world)

  randomizeSystem.update(entities)
  sizeEventSystem.update(entities)
  singleSizeEventSystem.update(entities)
  chatSystem.update(entities)
  colorEventSystem.update(entities)

  groundedCheckSystem.update(entities, physicsSystem.world)
  movementSystem.update(dt, entities)

  animationSystem.update(entities)
  syncRotationSystem.update(entities)
  syncPositionSystem.update(entities)

  boundaryCheckSystem.update(entities)
  lockedRotationSystem.update(entities)
  networkSystem.update(entities)

  sleepCheckSystem.update(entities)
  physicsSystem.update()

  // Useful for DestroySystem
  eventSystem.afterUpdate(entities)
  lastUpdateTimestamp = now
}

try {
  gameLoop()
} catch (error) {
  console.error('Error in game loop:', error)
}
