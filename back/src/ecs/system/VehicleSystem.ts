import { Entity } from '../../../../shared/entity/Entity.js'
import { VehicleCreationSystem } from './VehicleCreationSystem.js'
import { VehicleMovementSystem } from './VehicleMovementSystem.js'
import Rapier from '../../physics/rapier.js'

export class VehicleSystem {
  private vehicleCreationSystem = new VehicleCreationSystem()
  private vehicleMovementSystem = new VehicleMovementSystem()

  update(entities: Entity[], world: Rapier.World, dt: number): void {
    this.vehicleCreationSystem.update(entities, world)
    this.vehicleMovementSystem.update(entities, dt)
  }
}
