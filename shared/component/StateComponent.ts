import { NetworkComponent } from "../network/NetworkComponent.js";
import {
  SerializedComponentType,
  SerializedStateComponent,
  SerializedStateType,
} from "../network/server/serialized.js";

export class StateComponent extends NetworkComponent {
  constructor(entityId: number, public state: SerializedStateType) {
    super(entityId, SerializedComponentType.STATE);
  }
  deserialize(data: SerializedStateComponent) {
    console.log("StateComponent.deserialize", data);
    this.state = data.state;
  }
  serialize(): SerializedStateComponent {
    return { state: this.state };
  }
}
