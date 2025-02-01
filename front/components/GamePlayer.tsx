'use client'
import { useEffect, useRef, useState } from 'react'
import { Game } from '@/game/game'
import GameHud from '@/components/GameHud'
import LoadingScreen from '@/components/LoadingScreen'
import { ChatListComponent } from '@shared/component/ChatComponent'
import { GameInfo } from '@/types'

export default function GamePlayer(gameInfo: GameInfo) {
  const [isLoading, setIsLoading] = useState(true)
  const [chat, updateChat] = useState<ChatListComponent>()
  const [gameInstance, setGameInstance] = useState<Game | null>(null) // Initialize as null
  const refContainer = useRef(null)

  useEffect(() => {
    async function initializeGame() {
      const game = Game.getInstance(gameInfo.websocketPort, refContainer)
      game.hud.passChatState(updateChat)
      setGameInstance(game)
      try {
        await game.start()
        setIsLoading(false)
      } catch (error) {
        console.error('Error connecting to WebSocket:', error)
      }
    }

    initializeGame()
  }, [gameInfo.websocketPort])

  return (
    <div className="fixed inset-0 w-full h-full">
      {isLoading && <LoadingScreen />}
      {gameInstance && ( // Only render if gameInstance is defined
        <div ref={refContainer}>
          <GameHud
            chatList={chat}
            sendMessage={gameInstance.hud.sendMessageToServer} // No need for optional chaining here
            gameInstance={gameInstance}
          />
        </div>
      )}
    </div>
  )
}
