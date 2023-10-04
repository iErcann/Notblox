import { pack, unpack } from "msgpackr";
import { App, DEDICATED_COMPRESSOR_3KB } from "uWebSockets.js";
import {
  ClientMessage,
  ClientMessageType,
} from "../../../../../shared/network/client/base.js";
import { InputMessage } from "../../../../../shared/network/client/input.js";
import { ServerMessageType } from "../../../../../shared/network/server/base.js";
import { ConnectionMessage } from "../../../../../shared/network/server/connection.js";
import { WebSocketComponent } from "../../component/WebsocketComponent.js";
import { EntityManager } from "../../entity/EntityManager.js";
import { Player } from "../../entity/Player.js";

type MessageHandler = (message: ClientMessage) => void;

export class WebsocketSystem {
  private port = 8001;
  private players: Player[] = [];
  private messageHandlers: Map<ClientMessageType, MessageHandler> = new Map();

  constructor() {
    const app = App();

    // Bind the methods to the current instance
    this.onMessage = this.onMessage.bind(this);
    this.onConnect = this.onConnect.bind(this);
    this.onClose = this.onClose.bind(this);

    app.ws("/*", {
      idleTimeout: 32,
      maxBackpressure: 1024,
      maxPayloadLength: 512,
      compression: DEDICATED_COMPRESSOR_3KB,
      message: this.onMessage, // Handle WebSocket messages
      open: this.onConnect,
      drain: (ws: any) => {
        console.log("WebSocket backpressure: " + ws.getBufferedAmount());
      },
      close: this.onClose,
    });

    app.listen(this.port, (listenSocket) => {
      if (listenSocket) {
        console.log(`WebSocket server listening on port ${this.port}`);
      } else {
        console.error(`Failed to listen on port ${this.port}`);
      }
    });

    this.addMessageHandler(ClientMessageType.INPUT, (message) => {
      const inputMessage = message as InputMessage;
      console.log(inputMessage);
    });
  }

  public addMessageHandler(type: ClientMessageType, handler: MessageHandler) {
    this.messageHandlers.set(type, handler);
  }

  public removeMessageHandler(type: ClientMessageType) {
    this.messageHandlers.delete(type);
  }

  private onMessage(ws: any, message: any, isBinary: boolean) {
    const clientMessage: ClientMessage = unpack(message);

    const handler = this.messageHandlers.get(clientMessage.t);
    if (handler) {
      handler(clientMessage);
    }
  }

  private findPlayer(ws: any) {
    return (
      this.players.find((player) => {
        const websocketComponent = player
          .getEntity()
          .getComponent(WebSocketComponent);
        return websocketComponent && websocketComponent.ws === ws;
      }) || null
    );
  }
  private onConnect(ws: any) {
    // const player = this.findPlayer(ws);
    const player = new Player(
      ws,
      Math.random() * 3,
      3 + Math.random() * 7,
      Math.random() * 3
    );
    // TODO: make handlers like WebsocketManager on client
    const connectionMessage: ConnectionMessage = {
      t: ServerMessageType.FIRST_CONNECTION,
      id: player.entity.id,
    };
    ws.send(pack(connectionMessage), true);
    this.players.push(player);
  }
  private onClose(ws: any, code: number, message: any) {
    // Find player
    const disconnectedPlayer = this.findPlayer(ws);

    if (!disconnectedPlayer) {
      console.error("Disconnect : Player not found ?", ws);
      return;
    }

    console.log("Disconnect : Player found !");
    // Remove player from Entity Manager
    EntityManager.getInstance().removeEntity(disconnectedPlayer.getEntity());
    // Remove player from local players list (idk if this is necessary)
    this.players.splice(this.players.indexOf(disconnectedPlayer), 1);
  }
}
