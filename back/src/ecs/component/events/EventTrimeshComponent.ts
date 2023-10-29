import { Component } from "../../../../../shared/component/Component.js";

export class EventTrimeshComponent extends Component {
  constructor(entityId: number, public filePath: string) {
    super(entityId);
  }
}
