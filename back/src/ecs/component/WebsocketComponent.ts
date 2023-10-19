// WebSocketComponent.ts

import { Component } from "../../../../shared/component/Component.js";

export class WebSocketComponent extends Component {
  constructor(
    entityId: number,
    public ws: any,
    // On the first snapshot, we send the whole state of the game
    public isFirstSnapshotSent = false
  ) {
    super(entityId);
  }
}
