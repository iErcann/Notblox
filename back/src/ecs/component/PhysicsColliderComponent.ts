import Rapier from "../../physics/rapier.js";
import { Component } from "./component.js";

export class PhysicsColliderComponent extends Component {
  constructor(entityId: number, public collider: Rapier.Collider) {
    super(entityId);
  }
}
