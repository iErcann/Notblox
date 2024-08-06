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
import { PhysicsSystem as RigidBodyPhysicsSystem } from './ecs/system/physics/RigidBodyPhysicsSwitch.js'
import { SleepCheckSystem } from './ecs/system/physics/SleepCheckSystem.js'
import { SphereColliderSystem } from './ecs/system/physics/SphereColliderSystem.js'
import { SyncPositionSystem } from './ecs/system/physics/SyncPositionSystem.js'
import { SyncRotationSystem } from './ecs/system/physics/SyncRotationSystem.js'
import { TrimeshColliderSystem } from './ecs/system/physics/TrimeshColliderSystem.js'
import { PlayerComponent } from './ecs/component/tag/TagPlayerComponent.js'
import { ZombieSystem } from './ecs/system/ZombieSystem.js'
import Rapier from './physics/rapier.js'

// Initialize the physics world
const gravity = { x: 0.0, y: -100.0, z: 0.0 }
const world = new Rapier.World(gravity)

// Physics systems
const kinematicPhysicsBodySystem = new KinematicRigidBodySystem()
const rigidPhysicsBodySystem = new DynamicRigidBodySystem(world)
const physicsSystem = new RigidBodyPhysicsSystem(world)

const eventSystem = EventSystem.getInstance()
const entityManager = EntityManager.getInstance()
const entities = entityManager.getAllEntities()

// Physics bodies
const trimeshColliderSystem = new TrimeshColliderSystem()
const boxColliderSystem = new BoxColliderSystem()
const capsuleColliderSystem = new CapsuleColliderSystem()
const sphereColliderSystem = new SphereColliderSystem()
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
const networkSystem = new NetworkSystem(world)
const animationSystem = new AnimationSystem()
const sleepCheckSystem = new SleepCheckSystem()
const randomizeSystem = new RandomizeSystem()
const boundaryCheckSystem = new BoundaryCheckSystem()
const zombieSystem = new ZombieSystem()

const rigidBodyPhysicsSystem = new RigidBodyPhysicsSystem(world)

new Chat()
console.log(`Detected tick rate : ${config.SERVER_TICKRATE}`)
let lastUpdateTimestamp = Date.now()

function playersExists(): boolean {
  const player = EntityManager.getFirstEntityWithComponent(entities, PlayerComponent)
  return player !== undefined
}

async function gameLoop() {
  if (!playersExists()) {
    console.log('No players, waiting...')
    lastUpdateTimestamp = Date.now()
    setTimeout(gameLoop, 1000)
    return
  }

  setTimeout(gameLoop, 1000 / config.SERVER_TICKRATE)
  const now = Date.now()
  const dt = now - lastUpdateTimestamp

  destroyEventSystem.update(entities)

  kinematicPhysicsBodySystem.update(world)
  rigidPhysicsBodySystem.update(entities)

  trimeshColliderSystem.update(entities, world)
  boxColliderSystem.update(entities, world)
  capsuleColliderSystem.update(entities, world)
  sphereColliderSystem.update(entities, world)
  zombieSystem.update(dt, entities)
  randomizeSystem.update(entities)
  sizeEventSystem.update(entities)
  singleSizeEventSystem.update(entities)
  chatSystem.update(entities)
  colorEventSystem.update(entities)
  groundedCheckSystem.update(entities, world)
  movementSystem.update(dt, entities)
  animationSystem.update(entities)
  syncRotationSystem.update(entities)
  syncPositionSystem.update(entities)
  boundaryCheckSystem.update(entities)
  lockedRotationSystem.update(entities)
  networkSystem.update(entities)
  sleepCheckSystem.update(entities)

  rigidBodyPhysicsSystem.update()
  
  world.step()

  eventSystem.afterUpdate(entities)
  lastUpdateTimestamp = now
}

export function startGameLoop() {
  try {
    gameLoop()
  } catch (error) {
    console.error('Error in game loop:', error)
  }
}