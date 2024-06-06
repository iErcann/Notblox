import { SerializedComponent, SerializedComponentType } from '../network/server/serialized.js'
import { NetworkComponent } from '../network/NetworkComponent.js'

export class PositionComponent extends NetworkComponent {
  constructor(entityId: number, public x: number, public y: number, public z: number) {
    super(entityId, SerializedComponentType.POSITION)
  }
  deserialize(data: SerializedPositionComponent): void {
    this.x = data.x
    this.y = data.y
    this.z = data.z
  }
  serialize(): SerializedPositionComponent {
    return {
      x: Number(this.x.toFixed(2)),
      y: Number(this.y.toFixed(2)),
      z: Number(this.z.toFixed(2)),
    }
  }
}

export interface SerializedPositionComponent extends SerializedComponent {
  x: number
  y: number
  z: number
}
