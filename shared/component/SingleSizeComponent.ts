import {
  SerializedComponentType,
  SerializedSingleSizeComponent,
} from "../network/server/serialized.js";

import { NetworkComponent } from "../network/NetworkComponent.js";

export class SingleSizeComponent extends NetworkComponent {
  constructor(entityId: number, public size: number) {
    super(entityId, SerializedComponentType.SINGLE_SIZE);
  }
  deserialize(data: SerializedSingleSizeComponent): void {
    this.size = data.size;
    console.log("Deserializing single size component", this.size);
  }
  serialize(): SerializedSingleSizeComponent {
    return {
      size: Number(this.size.toFixed(2)),
    };
  }
}
