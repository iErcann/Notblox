'use client'
import { useEffect, useRef, useState } from 'react'
import { Game } from '@/game/Game'
import GameHud from '@/components/GameHud'
import LoadingScreen from '@/components/LoadingScreen'
import { MessageListComponent } from '@shared/component/MessageComponent'
import { GameInfo } from '@/types'

interface GamePlayerProps extends GameInfo {
  playerName?: string;
}

export default function GamePlayer({ playerName, ...gameInfo }: GamePlayerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [chat, updateChat] = useState<MessageListComponent>()
  const [gameInstance, setGameInstance] = useState<Game | null>(null) // Initialize as null
  const refContainer = useRef(null)

  useEffect(() => {
    async function initializeGame() {
      const game = Game.getInstance(gameInfo.websocketPort, refContainer)
      game.hud.passChatState(updateChat)
      setGameInstance(game)
      try {
        await game.start()
        
        // Set player name if provided
        if (playerName && playerName.trim()) {
          game.setPlayerName(playerName.trim())
        }
        
        setIsLoading(false)
      } catch (error) {
        console.error('Error connecting to WebSocket:', error)
      }
    }

    initializeGame()
  }, [gameInfo.websocketPort, playerName])

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
