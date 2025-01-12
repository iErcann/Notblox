import { SerializedComponentType } from '../../network/server/serialized.js'
import { NetworkComponent } from '../../network/NetworkComponent.js'

/**
 * NetworkEvent that is sent when an entity is destroyed
 *
 * Used to clean up the entity on the client side (remove mesh, etc)
 */
export class EntityDestroyedEvent extends NetworkComponent {
  constructor(entityId: number) {
    super(entityId, SerializedComponentType.ENTITY_DESTROYED_EVENT)
  }

  deserialize(data: SerializedEntityDestroyedEvent): void {
    this.entityId = data.id
  }
  serialize(): SerializedEntityDestroyedEvent {
    return {
      id: this.entityId,
    }
  }
}

export interface SerializedEntityDestroyedEvent {
  // Destroyed entity id
  id: number
}
