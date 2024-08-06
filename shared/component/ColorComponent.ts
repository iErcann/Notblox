import { SerializedComponent, SerializedComponentType } from '../network/server/serialized.js'
import { NetworkComponent } from '../network/NetworkComponent.js'

// Define a ColorComponent class
export class ColorComponent extends NetworkComponent {
  constructor(entityId: number, public color: string) {
    super(entityId, SerializedComponentType.COLOR) // Call the parent constructor with the entityId
  }
  deserialize(data: SerializedColorComponent): void {
    this.color = data.color
  }
  serialize(): SerializedColorComponent {
    return {
      color: this.color,
    }
  }
}

export interface SerializedColorComponent extends SerializedComponent {
  color: string
}
