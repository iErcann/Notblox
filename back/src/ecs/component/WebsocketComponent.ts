// WebSocketComponent.ts

import { Component } from "../../../../shared/component/Component.js";

export class WebSocketComponent extends Component {
  constructor(
    entityId: number,
    public ws: any,
    public isFirstSnapshotSent = false
  ) {
    super(entityId);
  }
}
