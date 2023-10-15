import { unpack } from "msgpackr/unpack"; // if you only need to unpack
import { ServerMessage, ServerMessageType } from "@shared/network/server/base";
import { Server } from "http";
import { SnapshotMessage } from "@shared/network/server/serialized";
import { Game } from "./game";
import { ConnectionMessage } from "@shared/network/server/connection";
import { InputMessage } from "@shared/network/client/input";
import { ClientMessage, ClientMessageType } from "@shared/network/client/base";
import { pack } from "msgpackr";

type MessageHandler = (message: ServerMessage) => void;

export class WebSocketManager {
  private websocket: WebSocket | null = null;
  private messageHandlers: Map<ServerMessageType, MessageHandler> = new Map();
  private serverUrl: string;
  public timeSinceLastServerUpdate: number = 0;
  constructor(game: Game) {
    // Check the NODE_ENV environment variable
    console.log(process.env);
    const isProduction = process.env.NEXT_PUBLIC_NODE_ENV === "production";
    console.log("production", isProduction);
    // Set the serverUrl based on the environment
    this.serverUrl = isProduction
      ? "wss://evalugem.com/ws"
      : "ws://localhost:8001";

    this.addMessageHandler(ServerMessageType.FIRST_CONNECTION, (message) => {
      const connectionMessage = message as ConnectionMessage;
      game.currentPlayerId = connectionMessage.id;
      console.log("first connection", game.currentPlayerId);
    });

    this.addMessageHandler(ServerMessageType.SNAPSHOT, (message) => {
      this.timeSinceLastServerUpdate = 0;
      const snapshotMessage = message as SnapshotMessage;
      game.syncComponentSystem.update(
        game.entityManager.getAllEntities(),
        snapshotMessage
      );
    });
  }

  public async connect(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (!this.isConnected()) {
        this.websocket = new WebSocket(this.serverUrl);
        this.websocket.addEventListener("open", (event) => {
          console.log("WebSocket connection opened:", event);
          resolve(); // Resolve the promise when the connection is open.
        });
        this.websocket.addEventListener("message", this.onMessage.bind(this));
        this.websocket.addEventListener("error", (errorEvent) => {
          console.error("WebSocket error:", errorEvent);
          reject(errorEvent); // Reject the promise on error.
        });
        this.websocket.addEventListener("close", (closeEvent) => {
          if (closeEvent.wasClean) {
            console.log(
              `WebSocket connection closed cleanly, code=${closeEvent.code}, reason=${closeEvent.reason}`
            );
          } else {
            console.error("WebSocket connection abruptly closed");
          }
        });
      } else {
        resolve(); // WebSocket already exists, resolve without a value.
      }
    });
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

  public send(message: ClientMessage) {
    if (this.isConnected()) {
      this.websocket!.send(pack(message));
    } else {
      console.error("Websocket doesnt exist can't send message", message);
    }
  }
  private isConnected(): boolean {
    return (
      this.websocket != null && this.websocket.readyState === WebSocket.OPEN
    );
  }
  private async onMessage(event: MessageEvent) {
    const buffer = await event.data.arrayBuffer();
    const message: ServerMessage = unpack(buffer);

    const handler = this.messageHandlers.get(message.t);
    if (handler) {
      handler(message);
    }
  }

  public update() {}
}
