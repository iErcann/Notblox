import { DynamicRayCastVehicleController } from '@dimforge/rapier3d-compat'
import { Component } from '../../../../../shared/component/Component.js'

export class VehicleRayCastComponent extends Component {
  constructor(entityId: number, public raycastController?: DynamicRayCastVehicleController) {
    super(entityId)
  }
}
