import Image from "next/image";
import { Inter } from "next/font/google";
import { useEffect } from "react";
import websocket from "@/components/websocket";
import { Game } from "@/components/game";
import startWebSocket from "@/components/websocket";

export default function Home() {
  useEffect(() => {
    const game = Game.getInstance();
    startWebSocket(game);
    game.start();
  }, []);
  return <div>{/* Render your component */}</div>;
}
