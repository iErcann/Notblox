import { Component, Serializable } from "./component.js";

// Define a RotationComponent class
export class RotationComponent extends Component implements Serializable {
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
      pitch: this.pitch,
      yaw: this.yaw,
      roll: this.roll,
    };
  }
}
