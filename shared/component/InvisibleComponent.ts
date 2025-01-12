import { SerializedComponent, SerializedComponentType } from '../network/server/serialized.js'
import { NetworkComponent } from '../network/NetworkComponent.js'

// Attach this to an entity to make it invisible (Applies on the MeshComponent)
export class InvisibleComponent extends NetworkComponent {
  constructor(entityId: number) {
    super(entityId, SerializedComponentType.INVISIBLE)
  }

  serialize(): SerializedInvisibleComponent {
    return {}
  }

  deserialize(data: SerializedInvisibleComponent): void {}
}

export interface SerializedInvisibleComponent extends SerializedComponent {}
