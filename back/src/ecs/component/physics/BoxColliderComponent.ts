import Rapier from '../../../physics/rapier.js'
import { Component } from '../../../../../shared/component/Component.js'

export class BoxColliderComponent extends Component {
  constructor(entityId: number, public collider?: Rapier.Collider) {
    super(entityId)
  }
}
