import { useEffect, useState } from "react";
import { Game } from "@/game/game";
import GameHud from "@/components/GameHud";
import LoadingScreen from "@/components/LoadingScreen";
import { ChatListComponent } from "@shared/component/ChatComponent";
import { Chat } from "@/game/ecs/entity/Chat";

export default function TestServer() {
  const [isLoading, setIsLoading] = useState(true);
  const [chat, updateChat] = useState<ChatListComponent>();
  const [game, setGame] = useState<Game>();

  useEffect(() => {
    async function initializeGame() {
      const game = Game.getInstance();
      game.hud.passChatState(updateChat);
      setGame(game);
      try {
        await game.start(); // Wait for WebSocket connection
        setIsLoading(false); // Update state to stop showing "connecting" message
      } catch (error) {
        console.error("Error connecting to WebSocket:", error);
      }
    }

    initializeGame();
  }, []);

  useEffect(() => {
    if (!chat) return;
    console.log("REceived");
  }, [chat]);

  return (
    <>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <GameHud chatList={chat} sendMessage={game?.hud.sendMessageToServer!} />
      )}
    </>
  );
}
