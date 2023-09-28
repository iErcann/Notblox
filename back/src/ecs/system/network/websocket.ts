import { DEDICATED_COMPRESSOR_3KB } from "uWebSockets.js";
import { App } from "uWebSockets.js";
import { Player } from "../../entity/Player.js";

function handleMessage(ws: any, message: any, isBinary: boolean) {
  // You can implement custom message handling here
  // For now, we'll just echo the message back
  // let ok = ws.send(message, isBinary, true);
  // new Player(ws, 1, 1, 1);
}

function onConnect(ws: any) {
  if (!ws) return;
  new Player(ws, 1, 1, 1);
}

export function startWebSocket(port: number) {
  const app = App();

  app.ws("/*", {
    idleTimeout: 32,
    maxBackpressure: 1024,
    maxPayloadLength: 512,
    compression: DEDICATED_COMPRESSOR_3KB,
    message: handleMessage, // Handle WebSocket messages
    open: onConnect,
  });

  app.listen(port, (listenSocket) => {
    if (listenSocket) {
      console.log(`WebSocket server listening on port ${port}`);
    } else {
      console.error(`Failed to listen on port ${port}`);
    }
  });
}
