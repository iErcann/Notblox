import { Component, ComponentEnum, Serializable } from "./component.js";

// Define a RotationComponent class
export class RotationComponent extends Component implements Serializable {
  type = ComponentEnum.ROTATION;
  constructor(
    entityId: number,
    public pitch: number, // Pitch rotation (e.g., around X-axis)
    public yaw: number, // Yaw rotation (e.g., around Y-axis)
    public roll: number // Roll rotation (e.g., around Z-axis)
  ) {
    super(entityId); // Call the parent constructor with the entityId
  }
  serialize() {
    return {
      p: this.pitch,
      y: this.yaw,
      r: this.roll,
    };
  }
}
