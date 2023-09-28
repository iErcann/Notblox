// WebSocketComponent.ts

import WebSocket from "uWebSockets.js";
import { Component } from "./component.js";

export class WebSocketComponent extends Component {
  constructor(entityId: number, public ws: WebSocket) {
    super(entityId);
  }
}
