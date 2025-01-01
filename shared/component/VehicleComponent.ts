import { SerializedComponent, SerializedComponentType } from '../network/server/serialized.js'
import { NetworkComponent } from '../network/NetworkComponent.js'

export class VehicleComponent extends NetworkComponent {
  constructor(
    entityId: number,
    public driverEntityId?: number,
    public passengerEntityIds?: number[]
  ) {
    super(entityId, SerializedComponentType.VEHICLE)
  }
  serialize() {
    return {
      d: this.driverEntityId,
    }
  }
  deserialize(data: SerializedVehicleComponent): void {
    this.driverEntityId = data.d
  }
}

export interface SerializedVehicleComponent extends SerializedComponent {
  d: number
}
