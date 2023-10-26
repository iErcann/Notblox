import { Component } from "../../../../../shared/component/Component.js";

export class EventColorComponent extends Component {
  constructor(entityId: number, public color: string) {
    super(entityId);
  }
}
