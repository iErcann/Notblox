import { SerializedComponentType } from '../../network/server/serialized.js'
import { NetworkComponent } from '../../network/NetworkComponent.js'
import { Component } from '../Component.js'
import { ComponentWrapper } from './ComponentWrapper.js'

export class ComponentRemovedEvent<T extends Component> extends ComponentWrapper<T> {
  constructor(component: T) {
    super(component)
  }
}

/**
 * ComponentRemovedEvent that is sent to the client when a component is removed
 * Since there is component unicity, the type of the component is enough to know which component is removed
 * @param removedComponentType The type of the component that was removed
 */
export class SerializableComponentRemovedEvent extends NetworkComponent {
  constructor(entityId: number, public removedComponentType: SerializedComponentType) {
    super(entityId, SerializedComponentType.COMPONENT_REMOVED_EVENT)
  }

  serialize(): SerializedComponentRemovedEvent {
    return {
      cT: this.removedComponentType,
      eId: this.entityId,
    }
  }

  deserialize(data: SerializedComponentRemovedEvent): void {
    this.removedComponentType = data.cT
    // Be careful to override the event entity id
    this.entityId = data.eId
  }
}

// Interface for serialized data
export interface SerializedComponentRemovedEvent {
  cT: SerializedComponentType
  eId: number
}
