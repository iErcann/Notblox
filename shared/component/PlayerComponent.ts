import { SerializedComponent, SerializedComponentType } from '../network/server/serialized.js'
import { NetworkComponent } from '../network/NetworkComponent.js'

export class PlayerComponent extends NetworkComponent {
  constructor(entityId: number, public name: string = 'Player' + entityId) {
    super(entityId, SerializedComponentType.PLAYER)
  }

  serialize(): SerializedPlayerComponent {
    return {
      n: this.name,
    }
  }

  deserialize(data: SerializedPlayerComponent): void {
    if (data && data.n) {
      this.name = data.n
    }
  }
}

export interface SerializedPlayerComponent extends SerializedComponent {
  n: string
}


