import { useEffect, useState } from "react";
import { Game } from "@/game/game";
import GameHud from "@/components/GameHud";
import LoadingScreen from "@/components/LoadingScreen";
import { ChatListComponent } from "@shared/component/ChatComponent";
import { Chat } from "@/game/ecs/entity/Chat";
import { NextSeo } from "next-seo";

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

  return (
    <>
      <NextSeo
        title="Play Test World - Development Server"
        description="Test server for NotBlox Online"
        openGraph={{
          url: "https://www.url.ie/a",
          title: "Open Graph Title",
          description: "Open Graph Description",
          images: [
            {
              url: "/Logo.png",
              width: 800,
              height: 600,
              alt: "NotBlox Logo",
              type: "image/png",
            },
          ],
          siteName: "NotBlox Online",
        }}
        twitter={{
          handle: "@handle",
          site: "@site",
          cardType: "summary_large_image",
        }}
      />
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <GameHud chatList={chat} sendMessage={game?.hud.sendMessageToServer!} />
      )}
    </>
  );
}
