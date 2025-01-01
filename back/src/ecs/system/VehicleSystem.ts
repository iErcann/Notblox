import { Entity } from '../../../../shared/entity/Entity.js'
import { VehicleCreationSystem } from './VehicleCreationSystem.js'
import { VehicleMovementSystem } from './VehicleMovementSystem.js'
import Rapier from '../../physics/rapier.js'

export class VehicleSystem {
  vehicleCreationSystem: VehicleCreationSystem
  vehicleMovementSystem: VehicleMovementSystem
  constructor() {
    this.vehicleCreationSystem = new VehicleCreationSystem()
    this.vehicleMovementSystem = new VehicleMovementSystem(this.vehicleCreationSystem)
  }

  update(entities: Entity[], world: Rapier.World, dt: number): void {
    this.vehicleCreationSystem.update(entities, world)
    this.vehicleMovementSystem.update(entities, dt)
  }
}
