import { SerializedComponent, SerializedComponentType } from '../network/server/serialized.js'

import { NetworkComponent } from '../network/NetworkComponent.js'

export class SingleSizeComponent extends NetworkComponent {
  constructor(entityId: number, public size: number) {
    super(entityId, SerializedComponentType.SINGLE_SIZE)
  }
  deserialize(data: SerializedSingleSizeComponent): void {
    this.size = data.size
  }
  serialize(): SerializedSingleSizeComponent {
    return {
      size: Number(this.size.toFixed(2)),
    }
  }
}

export interface SerializedSingleSizeComponent extends SerializedComponent {
  size: number
}
