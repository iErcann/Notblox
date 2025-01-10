import { SerializedComponent, SerializedComponentType } from '../network/server/serialized.js'
import { NetworkComponent } from '../network/NetworkComponent.js'
import { SerializedWheelComponent, WheelComponent } from './WheelComponent.js'
import { PositionComponent } from './PositionComponent.js'
import { RotationComponent } from './RotationComponent.js'

/**
 * Attach this component to an entity to make it a vehicle.
 * The entity will also automatically get a VehicleRayCastComponent attached to it.
 */
export class VehicleComponent extends NetworkComponent {
  public driverEntityId?: number
  public passengerEntityIds: number[] = []

  constructor(entityId: number, public wheels: WheelComponent[] = []) {
    super(entityId, SerializedComponentType.VEHICLE)
  }
  serialize() {
    return {
      d: this.driverEntityId,
      p: this.passengerEntityIds,
      w: this.wheels.map((wheel) => wheel.serialize()),
    }
  }
  deserialize(data: SerializedVehicleComponent): void {
    this.driverEntityId = data.d
    this.passengerEntityIds = data.p
    for (let i = 0; i < data.w.length; i++) {
      if (!this.wheels[i]) {
        this.wheels[i] = new WheelComponent({
          entityId: this.entityId,
          positionComponent: new PositionComponent(
            this.entityId,
            data.w[i].pC.x,
            data.w[i].pC.y,
            data.w[i].pC.z
          ),
          rotationComponent: new RotationComponent(
            this.entityId,
            data.w[i].rC.x,
            data.w[i].rC.y,
            data.w[i].rC.z
          ),
        })
      } else {
        this.wheels[i].deserialize(data.w[i])
      }
    }
  }
}

export interface SerializedVehicleComponent extends SerializedComponent {
  // Driver entity id
  d: number
  // Passenger entity ids
  p: number[]
  // Wheels (Debugging purpose for now.)
  w: SerializedWheelComponent[]
}
