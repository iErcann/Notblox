import { Component } from "./component.js";

// Define a VelocityComponent class
export class VelocityComponent extends Component {
  constructor(entityId: number, public dx: number, public dy: number) {
    super(entityId); // Call the parent constructor with the entityId
  }
}
