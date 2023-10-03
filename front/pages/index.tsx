import { useEffect } from "react";
import { Game } from "@/components/game";

export default function Home() {
  useEffect(() => {
    const game = Game.getInstance();
    game.start();
  }, []);
  return <div>{/* Render your component */}</div>;
}
