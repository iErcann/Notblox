import {
  SerializedComponentType,
  SerializedSizeComponent,
} from "../network/server/serialized.js";

import { NetworkComponent } from "../network/NetworkComponent.js";

export class DestroyedComponent extends NetworkComponent {
  constructor(entityId: number) {
    super(entityId, SerializedComponentType.DESTROYED);
  }

  deserialize(data: any): void {}
  serialize(): any {
    return {};
  }
}
