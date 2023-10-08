import {
  SerializedComponentType,
  SerializedPositionComponent,
} from "../network/server/serialized.js";
import { Component, Serializable } from "../component/Component.js";
import { NetworkComponent } from "../network/NetworkComponent.js";

// Define a PositionComponent class
export class PositionComponent extends NetworkComponent {
  constructor(
    entityId: number,
    public x: number,
    public y: number,
    public z: number
  ) {
    super(entityId, SerializedComponentType.POSITION); // Call the parent constructor with the entityId
  }
  deserialize(data: SerializedPositionComponent): void {
    this.x = data.x;
    this.y = data.y;
    this.z = data.z;
  }
  serialize(): SerializedPositionComponent {
    return {
      x: Number(this.x.toFixed(2)),
      y: Number(this.y.toFixed(2)),
      z: Number(this.z.toFixed(2)),
    };
  }
}
