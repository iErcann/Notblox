import { DEDICATED_COMPRESSOR_3KB } from "uWebSockets.js";
import { App } from "uWebSockets.js";
import { Player } from "../../entity/Player.js";
import { WebSocketComponent } from "../../component/WebsocketComponent.js";
import { EntityManager } from "../../entity/EntityManager.js";
import { ConnectionMessage } from "../../../../../shared/network/server/connection.js";
import { ServerMessageType } from "../../../../../shared/network/server/base.js";
import { pack } from "msgpackr";
export class WebsocketSystem {
  private port = 8001;
  private players: Player[] = [];
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
  }
  private onMessage(ws: any, message: any, isBinary: boolean) {
    // You can implement custom message handling here
    // For now, we'll just echo the message back
    // let ok = ws.send(message, isBinary, true);
    // new Player(ws, 1, 1, 1);
  }

  private onConnect(ws: any) {
    const player = new Player(ws, 0, 0, 0);
    const connectionMessage: ConnectionMessage = {
      t: ServerMessageType.FIRST_CONNECTION,
      id: player.entity.id,
    };

    ws.send(pack(connectionMessage), true);
    this.players.push(player);
  }
  private onClose(ws: any, code: number, message: any) {
    // Find player
    const disconnectedPlayer = this.players.find(
      (player) => player.getEntity().getComponent(WebSocketComponent)?.ws === ws
    );

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
