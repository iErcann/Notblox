import { unpack } from "msgpackr/unpack"; // if you only need to unpack
import { ServerMessage, ServerMessageType } from "@shared/network/server/base";
import { Server } from "http";
import { SnapshotMessage } from "@shared/network/server/serialized";
import { Game } from "./game";
import { ConnectionMessage } from "@shared/network/server/connection";

type MessageHandler = (message: ServerMessage) => void;

export class WebSocketManager {
  private websocket: WebSocket | null = null;
  private messageHandlers: Map<ServerMessageType, MessageHandler> = new Map();

  constructor(game: Game, private serverUrl: string = "ws://localhost:8001") {
    this.connect();
    this.addMessageHandler(ServerMessageType.SNAPSHOT, (message) => {
      const snapshotMessage = message as SnapshotMessage;
      game.syncComponentSystem.update(
        game.entityManager.getAllEntities(),
        snapshotMessage
      );
    });

    this.addMessageHandler(ServerMessageType.FIRST_CONNECTION, (message) => {
      const connectionMessage = message as ConnectionMessage;
    });
  }

  public connect() {
    if (!this.websocket) {
      this.websocket = new WebSocket(this.serverUrl);
      this.websocket.addEventListener("open", this.onOpen.bind(this));
      this.websocket.addEventListener("message", this.onMessage.bind(this));
      this.websocket.addEventListener("error", this.onError.bind(this));
      this.websocket.addEventListener("close", this.onClose.bind(this));
    }
  }

  public disconnect() {
    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
    }
  }

  public addMessageHandler(type: ServerMessageType, handler: MessageHandler) {
    this.messageHandlers.set(type, handler);
  }

  public removeMessageHandler(type: ServerMessageType) {
    this.messageHandlers.delete(type);
  }

  private onOpen(event: Event) {
    console.log("WebSocket connection opened:", event);
  }

  private async onMessage(event: MessageEvent) {
    const buffer = await event.data.arrayBuffer();
    const message: ServerMessage = unpack(buffer);
    console.log("Received message:", message.t);

    const handler = this.messageHandlers.get(message.t);
    if (handler) {
      handler(message);
    }
  }

  private onError(error: Event) {
    console.error("WebSocket error:", error);
  }

  private onClose(event: CloseEvent) {
    if (event.wasClean) {
      console.log(
        `WebSocket connection closed cleanly, code=${event.code}, reason=${event.reason}`
      );
    } else {
      console.error("WebSocket connection abruptly closed");
    }
  }
}

/*
import { WebSocketManager } from "./WebSocketManager";

const serverUrl = "ws://localhost:8001"; // Replace with your WebSocket server URL

const webSocketManager = new WebSocketManager(serverUrl);

// Connect to the WebSocket server
webSocketManager.connect();

// Add message handlers
webSocketManager.addMessageHandler(ServerMessageType.SNAPSHOT, (message) => {
  // Handle SNAPSHOT message
});

webSocketManager.addMessageHandler(ServerMessageType.FIRST_CONNECTION, (message) => {
  // Handle FIRST_CONNECTION message
});

// ...

// To send messages, you can use the WebSocketManager's WebSocket instance:
if (webSocketManager.isConnected()) {
  webSocketManager.send(message);
}

// To disconnect:
webSocketManager.disconnect();


*/
