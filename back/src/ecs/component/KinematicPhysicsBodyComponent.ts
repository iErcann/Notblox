import Rapier from '../../physics/rapier.js'
import { Component } from '../../../../shared/component/Component.js'

export class KinematicPhysicsBodyComponent extends Component {
  constructor(entityId: number, public body: Rapier.RigidBody) {
    super(entityId)
  }
}
