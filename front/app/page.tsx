import GameCard from '@/components/GameCard'
import KeyboardLayout from '@/components/KeyboardLayout'
import Navbar from '@/components/Navbar'
import { ExternalLink, Github, Play, Twitter } from 'lucide-react'
import Link from 'next/link'
import { GameInfo } from '../types'
import gameData from '../public/gameData.json'
import Head from 'next/head'
import { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'NotBlox - Play multiplayer games in your browser',
    description:
      'Play multiplayer games in your browser. Create your own games and share them with your friends.',
    openGraph: {
      title: 'NotBlox - Play multiplayer games in your browser',
      description:
        'Play multiplayer games in your browser. Create your own games and share them with your friends.',
      images: ['/PreviewTestGame.webp'],
      siteName: 'NotBlox Online',
    },
    twitter: {
      card: 'summary_large_image',
      site: '@iercan_',
      creator: '@iercan_',
    },
  }
}

export default async function Home() {
  const games = gameData as GameInfo[]
  return (
    <main className="p-4 area">
      <div className="space-y-8  flex flex-col items-center">
        <Navbar />
        <p className="text-2xl">Play multiplayer games in your browser</p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 w-full lg:w-[1000px]">
          {games && games.map((game, index) => <GameCard key={index} {...game} />)}
        </div>
        <KeyboardLayout />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 my-4">
          <Link
            href={'https://discord.gg/kPhgtj49U2'}
            className="flex py-2 items-center justify-center   px-8   font-medium   border border-transparent rounded-md hover:bg-gray-100   md:text-lg md:px-10"
          >
            <ExternalLink className="mr-2" />
            Project Discord
          </Link>
          <Link
            href={'https://twitter.com/iErcan_'}
            className="flex py-2 items-center justify-center  px-8   font-medium   border border-transparent rounded-md hover:bg-gray-100    md:text-lg md:px-10"
          >
            <Twitter className="mr-2" />
            Twitter
          </Link>
          <Link
            href={'https://github.com/iErcann/Notblox'}
            className="flex py-2 items-center justify-center   px-8   font-medium  border border-transparent rounded-md hover:bg-gray-100   md:text-lg md:px-10"
          >
            <Github className="mr-2" />
            Source Code
          </Link>
        </div>
      </div>
    </main>
  )
}
