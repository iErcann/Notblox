import gameData from '../../../public/gameData.json'
import { GameInfo } from '@/types'
import GamePlayer from '@/components/GamePlayer'
import { Metadata } from 'next'
import Navbar from '../../../components/Navbar'
import Link from 'next/link'

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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <main className="container mx-auto px-4">
        <Navbar />
        <div className="max-w-7xl mx-auto">
          {/* Game Header */}
          <div className="flex flex-col lg:flex-row gap-8 mb-12">
            <div className="lg:w-2/3">
              <div className="relative group rounded-2xl overflow-hidden shadow-lg hover:shadow-md transition-shadow duration-300 border border-gray-200">
                <img
                  src={gameInfo.imageUrl}
                  alt={`${gameInfo.title} cover`}
                  className="w-full h-96 object-cover transform transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-transparent" />
              </div>
            </div>

            <div className="lg:w-1/3 flex flex-col justify-center">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                {gameInfo.title}
              </h1>
              <p className="text-gray-600 text-lg mb-6">{gameInfo.metaDescription}</p>
              <Link
                href={`/play/${gameInfo.slug}?play=true`}
                className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105 inline-block text-center shadow-md hover:shadow-lg"
              >
                Play Now →
              </Link>
            </div>
          </div>

          {/* Game Details */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-gray-900 text-xl font-bold mb-4">Features</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <span className="mr-2 text-blue-500">⭐</span> Multiplayer Support
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-blue-500">🎮</span> Controller Compatible
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-blue-500">🏆</span> Achievements System
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-gray-900 text-xl font-bold mb-4">Stats</h3>
              <div className="flex justify-between text-gray-600">
                <div>
                  <p className="text-2xl font-bold text-gray-900">1.2M+</p>
                  <p className="text-sm">Active Players</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">4.8</p>
                  <p className="text-sm">Average Rating</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-gray-900 text-xl font-bold mb-4">Recent Updates</h3>
              <p className="text-gray-600 text-sm">
                New map added - Version 2.1.0
                <span className="block text-blue-600 mt-2">Last updated: 3 days ago</span>
              </p>
            </div>
          </div>

          {/* Related Games */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">More Games</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {gameData.slice(0, 3).map((game) => (
                <Link
                  href={`/play/${game.slug}`}
                  key={game.slug}
                  className="bg-white rounded-xl p-4 hover:bg-gray-50 transition-all duration-300 shadow-sm hover:shadow-md border border-gray-100"
                >
                  <img
                    src={game.imageUrl}
                    alt={game.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h3 className="text-gray-900 font-semibold text-lg">{game.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2">{game.metaDescription}</p>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
