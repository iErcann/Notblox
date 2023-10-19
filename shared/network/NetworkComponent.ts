import { Component, Serializable } from "../component/Component.js";
import { SerializedComponentType } from "./server/serialized.js";

export class NetworkComponent extends Component implements Serializable {
  // By default, a network component is always sent
  // But it can happen that some NetworkComponent aren't sent each tick but rather when a change arrives
  // A WebsocketComponent can have a "initialSent" value which determines if its the first connection => then whe sould broadcast everything so the user as an initial copy of the components
  updated: boolean = true;

  constructor(entityId: number, public type: SerializedComponentType) {
    super(entityId);
  }

  serialize() {
    throw new Error("Method not implemented.");
  }
  deserialize(data: any): void {
    throw new Error("Method not implemented.");
  }
}
