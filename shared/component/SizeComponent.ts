import { SerializedComponent, SerializedComponentType } from '../network/server/serialized.js'

import { NetworkComponent } from '../network/NetworkComponent.js'

export class SizeComponent extends NetworkComponent {
  constructor(entityId: number, public width: number, public height: number, public depth: number) {
    super(entityId, SerializedComponentType.SIZE)
  }
  deserialize(data: SerializedSizeComponent): void {
    this.width = data.width
    this.height = data.height
    this.depth = data.depth
  }
  serialize(): SerializedSizeComponent {
    return {
      width: Number(this.width.toFixed(2)),
      height: Number(this.height.toFixed(2)),
      depth: Number(this.depth.toFixed(2)),
    }
  }
}

export interface SerializedSizeComponent extends SerializedComponent {
  width: number
  height: number
  depth: number
}
