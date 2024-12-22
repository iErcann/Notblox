// back/src/ecs/component/physics/ColliderPropertiesComponent.ts
import { Component } from '../../../../../shared/component/Component.js'

export class ColliderPropertiesComponent extends Component {
  constructor(
    entityId: number,
    public isSensor: boolean,
    public friction: number,
    public restitution: number
  ) {
    super(entityId)
  }
}
