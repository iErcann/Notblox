import { useEffect } from "react";
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
