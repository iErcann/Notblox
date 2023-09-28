import Rapier from "../../physics/rapier.js";
import { Component } from "./component.js";

export class PhysicsBodyComponent extends Component {
  constructor(entityId: number, public body: Rapier.RigidBody) {
    super(entityId);
  }
}
