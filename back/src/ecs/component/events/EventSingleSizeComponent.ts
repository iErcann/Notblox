import { Component } from "../../../../../shared/component/Component.js";

export class EventSingleSizeComponent extends Component {
  constructor(entityId: number, public size: number) {
    super(entityId);
  }
}
