import { Component } from "../../../../shared/component/Component.js";

export class GroundCheckComponent extends Component {
  constructor(entityId: number, public grounded: boolean = false) {
    super(entityId);
  }
}
