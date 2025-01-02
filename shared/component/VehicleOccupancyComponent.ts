import { SerializedComponent, SerializedComponentType } from '../network/server/serialized.js'
import { NetworkComponent } from '../network/NetworkComponent.js'

/**
 * Attach this component to an entity to track its occupancy in a vehicle.
 * Mostly attached to players when they enter a vehicle.
 */

export class VehicleOccupancyComponent extends NetworkComponent {
  constructor(entityId: number, public vehicleEntityId: number) {
    super(entityId, SerializedComponentType.VEHICLE_OCCUPANCY)
  }

  serialize(): SerializedVehicleOccupancyComponent {
    return {
      vId: this.vehicleEntityId,
    }
  }

  deserialize(data: SerializedVehicleOccupancyComponent): void {
    this.vehicleEntityId = data.vId
  }
}

export interface SerializedVehicleOccupancyComponent extends SerializedComponent {
  vId: number
}
