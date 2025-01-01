import 'dotenv/config'

import { EntityManager } from '../../shared/system/EntityManager.js'
import { config } from '../../shared/network/config.js'
import { EventSystem } from '../../shared/system/EventSystem.js'

import { Chat } from './ecs/entity/Chat.js'
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
import { PlayerComponent } from '../../shared/component/PlayerComponent.js'
import { ZombieSystem } from './ecs/system/ZombieSystem.js'
import { ScriptableSystem } from './ecs/system/ScriptableSystem.js'
import { ProximityPromptSystem } from './ecs/system/events/ProximityPromptEventSystem.js'
import { ConvexHullColliderSystem } from './ecs/system/physics/ConvexHullColliderSystem.js'
import { VehicleSystem } from './ecs/system/VehicleSystem.js'

// TODO: Make it wait for the websocket server to start
const eventSystem = EventSystem.getInstance()
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
const convexHullColliderSystem = new ConvexHullColliderSystem()

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
const proximityPromptSystem = new ProximityPromptSystem()

const movementSystem = new MovementSystem()
const vehicleSystem = new VehicleSystem()
const networkSystem = new NetworkSystem()

const animationSystem = new AnimationSystem()
const sleepCheckSystem = new SleepCheckSystem()
const randomizeSystem = new RandomizeSystem()
const boundaryCheckSystem = new BoundaryCheckSystem()
const zombieSystem = new ZombieSystem()

new Chat()
console.log(`Detected tick rate : ${config.SERVER_TICKRATE}`)
let lastUpdateTimestamp = Date.now()

let lastTickPlayerExisted = false
function atLeastOnePlayerExit() {
  const player = EntityManager.getFirstEntityWithComponent(entities, PlayerComponent)
  return player !== undefined
}
async function gameLoop() {
  // Idle mode if no players
  const playerExist = atLeastOnePlayerExit()

  // If no players, wait for one to join
  // Making an extra tick for entities that check player existence (E.g if no player exist on a game script, reset it)
  if (!playerExist && !lastTickPlayerExisted) {
    console.log('No players, waiting...')
    lastUpdateTimestamp = Date.now()
    setTimeout(gameLoop, 1000)
    return
  }
  // printMemoryUsage()
  setTimeout(gameLoop, 1000 / config.SERVER_TICKRATE)
  const now = Date.now()
  const dt = now - lastUpdateTimestamp

  destroyEventSystem.update(entities)
  physicsSystem.update(entities)
  boundaryCheckSystem.update(entities)
  ScriptableSystem.update(dt, entities)
  proximityPromptSystem.update(entities, dt)

  // Create the bodies first.
  kinematicPhysicsBodySystem.update(entities, physicsSystem.world)
  rigidPhysicsBodySystem.update(entities, physicsSystem.world)
  // Then handle the colliders
  trimeshColliderSystem.update(entities, physicsSystem.world)
  boxColliderSystem.update(entities, physicsSystem.world)
  capsuleColliderSystem.update(entities, physicsSystem.world)
  sphereColliderSystem.update(entities, physicsSystem.world)
  convexHullColliderSystem.update(entities, physicsSystem.world)

  zombieSystem.update(dt, entities)
  randomizeSystem.update(entities)
  sizeEventSystem.update(entities)
  singleSizeEventSystem.update(entities)
  chatSystem.update(entities)
  colorEventSystem.update(entities)

  groundedCheckSystem.update(entities, physicsSystem.world)
  movementSystem.update(dt, entities)
  vehicleSystem.update(entities, physicsSystem.world, dt)

  animationSystem.update(entities)
  syncRotationSystem.update(entities)
  syncPositionSystem.update(entities)

  lockedRotationSystem.update(entities)
  networkSystem.update(entities)
  sleepCheckSystem.update(entities)

  // Useful for DestroySystem
  eventSystem.afterUpdate(entities)
  lastUpdateTimestamp = now
  lastTickPlayerExisted = playerExist
}

export function startGameLoop() {
  try {
    gameLoop()
  } catch (error) {
    console.error('Error in game loop:', error)
  }
}
