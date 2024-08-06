import { useEffect, useRef, useState } from 'react'
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import { Game } from '@/game/game'
import GameHud from '@/components/GameHud'
import LoadingScreen from '@/components/LoadingScreen'
import { NextSeo } from 'next-seo'
import gameData from '../../public/gameData.json'
import { ChatListComponent } from '@shared/component/ChatComponent'
import { TransformControlsMode } from '@/game/ecs/system/TransformControlsSystem'

export interface GameInfo {
  title: string
  slug: string
  imageUrl: string
  websocketPort: number
  images?: { url: string; width: number; height: number; alt: string; type: string }[]
  metaDescription: string
}

interface GamePageProps {
  gameInfo: GameInfo
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = gameData.map((game) => ({
    params: { slug: game.slug },
  }))
  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps<GamePageProps> = async (context) => {
  const { slug } = context.params!
  const game = gameData.find((game) => game.slug === slug)

  return {
    props: {
      gameInfo: game!,
    },
    revalidate: 5 * 60,
  }
}

export default function GamePage({ gameInfo }: InferGetStaticPropsType<typeof getStaticProps>) {
  const [isLoading, setIsLoading] = useState(true)
  const [chat, updateChat] = useState<ChatListComponent>()
  const [gameInstance, setGameInstance] = useState<Game>()
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

  const setTransformControlsMode = (mode: TransformControlsMode) => {
    gameInstance?.setTransformControlsMode(mode);
  }

  return (
    <>
      <NextSeo
        title={`Play ${gameInfo.title} - NotBlox`}
        description={gameInfo.metaDescription}
        canonical={`https://www.notblox.online/play/${gameInfo.slug}`}
        openGraph={{
          title: `Play ${gameInfo.title} - NotBlox`,
          description: gameInfo.metaDescription,
          images: gameInfo.images ?? [],
          siteName: 'NotBlox Online',
        }}
        twitter={{
          handle: '@iercan_',
          site: '@iercan_',
          cardType: 'summary_large_image',
        }}
      />
      {isLoading && <LoadingScreen />}
      <div ref={refContainer} className="game-container">
        <GameHud
          chatList={chat}
          sendMessage={gameInstance?.hud.sendMessageToServer!}
          gameInstance={gameInstance}
          toggleTransformControls={() => gameInstance?.toggleTransformControls()}
          setTransformControlsMode={setTransformControlsMode}
        />
      </div>
    </>
  )
}