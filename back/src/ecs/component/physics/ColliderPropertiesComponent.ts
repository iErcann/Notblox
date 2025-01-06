// back/src/ecs/component/physics/ColliderPropertiesComponent.ts
import { Component } from '../../../../../shared/component/Component.js'

export interface ColliderPropertiesComponentData {
  isSensor?: boolean
  friction?: number
  restitution?: number
}

export class ColliderPropertiesComponent extends Component {
  constructor(entityId: number, public data: ColliderPropertiesComponentData) {
    super(entityId)
  }
}
