import { useEffect, useState } from "react";
import { Game } from "@/game/game";
import GameHud from "@/components/GameHud";
import LoadingScreen from "@/components/LoadingScreen";

export default function TestServer() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function initializeGame() {
      const game = Game.getInstance();
      try {
        await game.start(); // Wait for WebSocket connection
        setIsLoading(false); // Update state to stop showing "connecting" message
      } catch (error) {
        console.error("Error connecting to WebSocket:", error);
        // Handle the error if necessary
      }
    }

    initializeGame();
  }, []);

  return <>{isLoading ? <LoadingScreen /> : <GameHud />}</>;
}
