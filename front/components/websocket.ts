// import { unpack } from "msgpackr/unpack"; // if you only need to unpack
// import {
//   SerializedComponentType,
//   SerializedEntityType,
//   SnapshotMessage,
// } from "@shared/network/server/serialized";
// import { ConnectionMessage } from "@shared/network/server/connection";
// import { Game } from "./game";
// import { ServerMessage, ServerMessageType } from "@shared/network/server/base";
// const serverUrl = "ws://localhost:8001"; // Replace with your WebSocket server URL

// function startWebSocket(game: Game) {
//   // Create a WebSocket instance
//   const websocket = new WebSocket(serverUrl);

//   // Event handler for when the connection is established
//   websocket.addEventListener("open", (event) => {
//     console.log("WebSocket connection opened:", event);
//   });

//   // Event handler for incoming messages
//   websocket.addEventListener("message", async (event) => {
//     const message: ServerMessage = unpack(await event.data.arrayBuffer());
//     console.log(message.t);

//     if (message.t === ServerMessageType.SNAPSHOT) {
//       game.syncComponentSystem.update(
//         game.entityManager.getAllEntities(),
//         message as SnapshotMessage
//       );
//     } else if (message.t === ServerMessageType.FIRST_CONNECTION) {
//       const connectionMessage = message as ConnectionMessage;
//       game.onConnection(connectionMessage.id);
//       console.log("Connection", connectionMessage);
//     }
//   });

//   // Event handler for errors
//   websocket.addEventListener("error", (error) => {
//     console.error("WebSocket error:", error);
//   });

//   // Event handler for when the connection is closed
//   websocket.addEventListener("close", (event) => {
//     if (event.wasClean) {
//       console.log(
//         `WebSocket connection closed cleanly, code=${event.code}, reason=${event.reason}`
//       );
//     } else {
//       console.error("WebSocket connection abruptly closed");
//     }
//   });

//   return websocket;
// }

// export default startWebSocket;
