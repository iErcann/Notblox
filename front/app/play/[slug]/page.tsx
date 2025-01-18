import gameData from '../../../public/gameData.json'
import { GameInfo } from '@/types'
import GamePlayer from '@/components/GamePlayer'
import { Metadata } from 'next'

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const games = gameData as GameInfo[]

  return games.map((game) => ({
    slug: game.slug,
  }))
}

function getGamesBySlug(slug: string): GameInfo {
  const game = gameData.find((game) => game.slug === slug)
  if (!game) {
    throw new Error(`Game with slug "${slug}" not found`)
  }
  return game
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const gameInfo = getGamesBySlug(slug)
  return {
    title: `Play ${gameInfo.title} - NotBlox`,
    description: gameInfo.metaDescription,
    openGraph: {
      title: `Play ${gameInfo.title} - NotBlox`,
      description: gameInfo.metaDescription,
      images: gameInfo.images ?? [],
      siteName: 'NotBlox Online',
    },
    twitter: {
      card: 'summary_large_image',
      site: '@iercan_',
      creator: '@iercan_',
    },
    alternates: {
      canonical: `https://www.notblox.online/play/${gameInfo.slug}`,
    },
  }
}

export default async function GamePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const gameInfo = getGamesBySlug(slug)

  return (
    <>
      <GamePlayer {...gameInfo} />
    </>
  )
}
