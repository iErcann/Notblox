import { SerializedComponentType } from "../../network/server/serialized.js";

import { NetworkComponent } from "../../network/NetworkComponent.js";

export class EventDestroyedComponent extends NetworkComponent {
  constructor(entityId: number) {
    super(entityId, SerializedComponentType.DESTROYED);
  }

  deserialize(data: any): void {}
  serialize(): any {
    return {};
  }
}
