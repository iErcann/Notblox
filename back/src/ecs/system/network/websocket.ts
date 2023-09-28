import { DEDICATED_COMPRESSOR_3KB } from "uWebSockets.js";
import { App } from "uWebSockets.js";

function handleMessage(ws: any, message: any, isBinary: boolean) {
  // You can implement custom message handling here
  // For now, we'll just echo the message back
  let ok = ws.send(message, isBinary, true);
}

export function startWebSocket(port: number) {
  const app = App();

  app.ws("/*", {
    idleTimeout: 32,
    maxBackpressure: 1024,
    maxPayloadLength: 512,
    compression: DEDICATED_COMPRESSOR_3KB,
    message: handleMessage, // Handle WebSocket messages
  });

  app.listen(port, (listenSocket) => {
    if (listenSocket) {
      console.log(`WebSocket server listening on port ${port}`);
    } else {
      console.error(`Failed to listen on port ${port}`);
    }
  });
}
