import { Component, ComponentEnum, Serializable } from "./component.js";

// Define a PositionComponent class
export class PositionComponent extends Component implements Serializable {
  type = ComponentEnum.POSITION;
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
      x: Number(this.x.toFixed(2)),
      y: Number(this.y.toFixed(2)),
      z: Number(this.z.toFixed(2)),
    };
  }
}
