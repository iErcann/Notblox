// WebSocketComponent.ts

import { Component } from "./Component.js";

export class WebSocketComponent extends Component {
  constructor(entityId: number, public ws: any) {
    super(entityId);
  }
}
