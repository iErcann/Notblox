// components/GameContent.tsx
'use client' // Mark this as a Client Component

import { useState } from 'react'
import GamePlayer from '@/components/GamePlayer'
import { GameInfo } from '@/types'
import gameData from '../public/gameData.json'
import GameCard from './GameCard'
import Navbar from './Navbar'

export default function GameContent({ gameInfo }: { gameInfo: GameInfo }) {
  const [isPlaying, setIsPlaying] = useState(false)

  const handlePlayClick = () => {
    setIsPlaying(true)
  }

  return (
    <>
      {/* Conditionally render GamePlayer or Game Header */}
      {isPlaying ? (
        <GamePlayer {...gameInfo} />
      ) : (
        <div>
          <Navbar />
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
              <button
                onClick={handlePlayClick}
                className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105 inline-block text-center shadow-md hover:shadow-lg"
              >
                Play Now →
              </button>
            </div>
          </div>
          {/* Game Details */}
          <div className="grid md:grid-cols-3 gap-8 mb-12 ">
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
          <section className="w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 px-4 sm:px-0">More Games</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 ">
              {gameData.map((game) => (
                <GameCard {...game} height={64} key={game.slug} />
              ))}
            </div>
          </section>
        </div>
      )}
    </>
  )
}
