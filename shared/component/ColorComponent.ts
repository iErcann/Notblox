import {
  SerializedColorComponent,
  SerializedComponentType,
  SerializedPositionComponent,
} from "../network/server/serialized.js";
import { NetworkComponent } from "../network/NetworkComponent.js";

// Define a ColorComponent class
export class ColorComponent extends NetworkComponent {
  constructor(entityId: number, public color: string) {
    super(entityId, SerializedComponentType.COLOR); // Call the parent constructor with the entityId
  }
  deserialize(data: SerializedColorComponent): void {
    this.color = data.color;
  }
  serialize(): SerializedColorComponent {
    return {
      color: this.color,
    };
  }
}
