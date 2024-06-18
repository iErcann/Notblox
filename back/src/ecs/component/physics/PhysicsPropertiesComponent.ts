import { Component } from '../../../../../shared/component/Component.js'

export class PhysicsPropertiesComponent extends Component {
  constructor(entityId: number, public mass: number) {
    super(entityId)
  }
}
