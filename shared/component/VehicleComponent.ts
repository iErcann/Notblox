import { SerializedComponent, SerializedComponentType } from '../network/server/serialized.js'
import { NetworkComponent } from '../network/NetworkComponent.js'

/**
 * Attach this component to an entity to make it a vehicle.
 * The entity will also automatically get a VehicleRayCastComponent attached to it.
 *
 */
export class VehicleComponent extends NetworkComponent {
  public driverEntityId?: number
  public passengerEntityIds: number[] = []
  constructor(entityId: number) {
    super(entityId, SerializedComponentType.VEHICLE)
  }
  serialize() {
    return {
      d: this.driverEntityId,
      p: this.passengerEntityIds,
    }
  }
  deserialize(data: SerializedVehicleComponent): void {
    this.driverEntityId = data.d
    this.passengerEntityIds = data.p
  }
}

export interface SerializedVehicleComponent extends SerializedComponent {
  d: number
  p: number[]
}
