import { useEffect, useState } from 'react'
import { Game } from '@/game/game'
import GameHud from '@/components/GameHud'
import LoadingScreen from '@/components/LoadingScreen'
import { ChatListComponent } from '@shared/component/ChatComponent'
import { Chat } from '@/game/ecs/entity/Chat'
import { NextSeo } from 'next-seo'

export default function TestServer() {
  const [isLoading, setIsLoading] = useState(true)
  const [chat, updateChat] = useState<ChatListComponent>()
  const [game, setGame] = useState<Game>()

  useEffect(() => {
    async function initializeGame() {
      const game = Game.getInstance()
      game.hud.passChatState(updateChat)
      setGame(game)
      try {
        await game.start() // Wait for WebSocket connection
        setIsLoading(false) // Update state to stop showing "connecting" message
      } catch (error) {
        console.error('Error connecting to WebSocket:', error)
      }
    }

    initializeGame()
  }, [])

  return (
    <>
      <NextSeo
        title="Play Test World - NotBlox Development Server"
        description="Test server for NotBlox Online"
        canonical="https://www.notblox.online/test"
        openGraph={{
          title: 'Play Test World - NotBlox Development Server',
          description: 'Test server for NotBlox Online',
          images: [
            {
              url: '/Logo.png',
              width: 800,
              height: 600,
              alt: 'NotBlox Logo',
              type: 'image/png',
            },
            {
              url: '/BigPreview.webp',
              width: 1200,
              height: 630,
              alt: 'NotBlox Logo',
              type: 'image/webp',
            },
          ],
          siteName: 'NotBlox Online',
        }}
        twitter={{
          handle: '@iercan_',
          site: '@iercan_',
          cardType: 'summary_large_image',
        }}
      />
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <GameHud chatList={chat} sendMessage={game?.hud.sendMessageToServer!} />
      )}
    </>
  )
}
