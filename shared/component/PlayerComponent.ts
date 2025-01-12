import { SerializedComponentType } from '../network/server/serialized.js'
import { NetworkComponent } from '../network/NetworkComponent.js'

export class PlayerComponent extends NetworkComponent {
  serialize() {}
  deserialize(data: any): void {}
  constructor(entityId: number) {
    super(entityId, SerializedComponentType.PLAYER)
  }
}
