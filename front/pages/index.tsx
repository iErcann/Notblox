import Image from "next/image";
import { Inter } from "next/font/google";
import { useEffect } from "react";
import websocket from "@/components/websocket";
import { Game } from "@/components/game";

export default function Home() {
  useEffect(() => {
    // Send a message when the component mounts
    // websocket.send(JSON.stringify({ message: "Hello, WebSocket!" }));
    const game = new Game();
    game.start();
  }, []);
  return <div>{/* Render your component */}</div>;
}
