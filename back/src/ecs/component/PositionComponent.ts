import { Component, Serializable } from "./component.js";

// Define a PositionComponent class
export class PositionComponent extends Component implements Serializable {
  constructor(
    entityId: number,
    public x: number,
    public y: number,
    public z: number
  ) {
    super(entityId); // Call the parent constructor with the entityId
  }
  serialize() {
    return {
      x: this.x,
      y: this.y,
      z: this.z,
    };
  }
}
