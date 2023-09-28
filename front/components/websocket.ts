const serverUrl = "ws://localhost:9001"; // Replace with your WebSocket server URL

// Create a WebSocket instance
const websocket = new WebSocket(serverUrl);

// Event handler for when the connection is established
websocket.addEventListener("open", (event) => {
  console.log("WebSocket connection opened:", event);
});

// Event handler for incoming messages
websocket.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  console.log("Received message:", message);

  // Handle the incoming message as needed
  // For example, update the UI with the message content
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

export default websocket;
