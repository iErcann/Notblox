import {
  SerializedComponentType,
  SerializedRotationComponent,
} from "../serialized.js";
import { Component, Serializable } from "../component/Component.js";

// Define a RotationComponent class
export class RotationComponent extends Component implements Serializable {
  type = SerializedComponentType.ROTATION;

  // Define public properties for pitch, yaw, and roll
  constructor(
    entityId: number,
    public x: number,
    public y: number,
    public z: number,
    public w = 0
  ) {
    super(entityId); // Call the parent constructor with the entityId
  }
  deserialize(data: SerializedRotationComponent): void {
    this.x = data.x;
    this.y = data.y;
    this.z = data.z;
    this.w = data.w;
  }

  serialize(): SerializedRotationComponent {
    return {
      x: Number(this.x.toFixed(2)),
      y: Number(this.y.toFixed(2)),
      z: Number(this.z.toFixed(2)),
      w: Number(this.w.toFixed(2)),
    };
  }
}
