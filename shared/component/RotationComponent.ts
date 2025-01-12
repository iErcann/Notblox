import { SerializedComponent, SerializedComponentType } from '../network/server/serialized.js'
import { NetworkComponent } from '../network/NetworkComponent.js'

// Define a RotationComponent class
export class RotationComponent extends NetworkComponent {
  constructor(
    entityId: number,
    public x: number,
    public y: number,
    public z: number,
    public w = 0
  ) {
    super(entityId, SerializedComponentType.ROTATION)
  }

  getForwardDirection() {
    // Forward vector rotated by quaternion math
    const x = 2 * (this.x * this.z + this.w * this.y)
    const z = 1 - 2 * (this.x * this.x + this.y * this.y)
    z
    // Normalize the vector
    const length = Math.sqrt(x * x + z * z)
    return {
      x: x / length,
      z: z / length,
    }
  }
  deserialize(data: SerializedRotationComponent): void {
    this.x = data.x
    this.y = data.y
    this.z = data.z
    this.w = data.w
  }

  serialize(): SerializedRotationComponent {
    return {
      x: Number(this.x.toFixed(2)),
      y: Number(this.y.toFixed(2)),
      z: Number(this.z.toFixed(2)),
      w: Number(this.w.toFixed(2)),
    }
  }
}

export interface SerializedRotationComponent extends SerializedComponent {
  x: number
  y: number
  z: number
  w: number
}
