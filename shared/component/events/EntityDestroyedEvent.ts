import { SerializedComponentType } from '../../network/server/serialized.js'

import { NetworkComponent } from '../../network/NetworkComponent.js'

export class EntityDestroyedEvent extends NetworkComponent {
  constructor(entityId: number) {
    super(entityId, SerializedComponentType.DESTROYED_EVENT)
  }

  deserialize(data: any): void {
    console.log('EntityDestroyedEvent.deserialize()')
  }
  serialize(): any {
    console.log('EntityDestroyedEvent.serialize()')
    return {}
  }
}
