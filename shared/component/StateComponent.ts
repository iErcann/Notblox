import { NetworkComponent } from '../network/NetworkComponent.js'
import {
  SerializedComponent,
  SerializedComponentType,
  SerializedStateType,
} from '../network/server/serialized.js'

export class StateComponent extends NetworkComponent {
  constructor(entityId: number, public state: SerializedStateType) {
    super(entityId, SerializedComponentType.STATE)
  }
  deserialize(data: SerializedStateComponent) {
    this.state = data.state
  }
  serialize(): SerializedStateComponent {
    return { state: this.state }
  }
}

export interface SerializedStateComponent extends SerializedComponent {
  state: SerializedStateType
}
