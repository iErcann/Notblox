import { unpack } from "msgpackr/unpack"; // if you only need to unpack
import {
  SerializedComponentType,
  SerializedEntityType,
  SerializedNetworkData,
} from "@shared/serialized";
import { Game } from "./game";
const serverUrl = "ws://localhost:8001"; // Replace with your WebSocket server URL

function startWebSocket(game: Game) {
  // Create a WebSocket instance
  const websocket = new WebSocket(serverUrl);

  // Event handler for when the connection is established
  websocket.addEventListener("open", (event) => {
    console.log("WebSocket connection opened:", event);
  });

  // Event handler for incoming messages
  websocket.addEventListener("message", async (event) => {
    const message: SerializedNetworkData = unpack(
      await event.data.arrayBuffer()
    );
    message.forEach((entity) => {
      console.log("Entity:", entity.t);
      if (entity.t === SerializedEntityType.PLAYER) {
        console.log("Player:", entity.id);
        console.log("Components:", entity.c);
        entity.c.forEach((component) => {
          if (component.t === SerializedComponentType.POSITION) {
            console.log("Position:", component);
          }
          if (component.t === SerializedComponentType.ROTATION) {
            console.log("Rotation:", component);
          }
        });
      }
    });
  });

  // Event handler for errors
  websocket.addEventListener("error", (error) => {
    console.error("WebSocket error:", error);
  });

  // Event handler for when the connection is closed
  websocket.addEventListener("close", (event) => {
    if (event.wasClean) {
      console.log(
        `WebSocket connection closed cleanly, code=${event.code}, reason=${event.reason}`
      );
    } else {
      console.error("WebSocket connection abruptly closed");
    }
  });

  return websocket;
}

export default startWebSocket;
