import { Component, ComponentEnum, Serializable } from "./component.js";

// Define a RotationComponent class
export class RotationComponent extends Component implements Serializable {
  type = ComponentEnum.ROTATION;

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

  serialize() {
    return {
      x: this.x,
      y: this.y,
      z: this.z,
      w: 0, // Replace with the appropriate value if needed
    };
  }
}
