import { config } from '../../../../../shared/network/config.js'
import Rapier from '../../../physics/rapier.js'
import { CollisionSystem } from './CollisionSystem.js'
import { Entity } from '../../../../../shared/entity/Entity.js'

export class PhysicsSystem {
  world: Rapier.World // Rapier World
  private static instance: PhysicsSystem
  private collisionSystem = new CollisionSystem()
  private eventQueue: Rapier.EventQueue

  constructor() {
    const gravity = { x: 0.0, y: -9.81 * 10, z: 0.0 }
    this.world = new Rapier.World(gravity)
    this.world.timestep = 1 / config.SERVER_TICKRATE
    this.eventQueue = new Rapier.EventQueue(true)
    console.log(`Physics World constructed with tick rate: ${config.SERVER_TICKRATE}`)
  }

  update(entities: Entity[]) {
    this.world.step(this.eventQueue)
    this.collisionSystem.update(entities, this.world, this.eventQueue)
  }
  static getInstance(): PhysicsSystem {
    if (!PhysicsSystem.instance) {
      PhysicsSystem.instance = new PhysicsSystem()
    }
    return PhysicsSystem.instance
  }
}
