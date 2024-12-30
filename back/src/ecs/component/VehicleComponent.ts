import { Component } from '../../../../shared/component/Component.js'

export class VehicleComponent extends Component {
  constructor(entityId: number, public driverEntityId?: number) {
    super(entityId)
  }
}
