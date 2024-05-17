import Rapier from '../../physics/rapier.js'
import { Component } from '../../../../shared/component/Component.js'

export class PhysicsColliderComponent extends Component {
  constructor(
    entityId: number,
    public collider: Rapier.Collider
  ) {
    super(entityId)
  }
}
