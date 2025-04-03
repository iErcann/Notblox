// components/GameContent.tsx
'use client'

import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import GamePlayer from '@/components/GamePlayer'
import { GameInfo } from '@/types'
import gameData from '../public/gameData.json'
import GameCard from './GameCard'
import Navbar from './Navbar'

export default function GameContent({ gameInfo }: { gameInfo: GameInfo }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [playerName, setPlayerName] = useState('')

  // Load player name from localStorage on component mount
  useEffect(() => {
    const savedName = localStorage.getItem('playerName')
    if (savedName) {
      setPlayerName(savedName)
    }
  }, [])

  const handlePlayClick = () => {
    // Save player name to localStorage
    if (playerName.trim()) {
      localStorage.setItem('playerName', playerName.trim())
    }
    setIsPlaying(true)
  }

  return (
    <>
      {isPlaying ? (
        <GamePlayer {...gameInfo} playerName={playerName} />
      ) : (
        <div className="px-4 container mx-auto">
          <Navbar />
          <div className="flex flex-col lg:flex-row gap-8 mb-12">
            {/* Image Section - Larger and Clickable */}
            <div className="lg:w-2/3 cursor-pointer" onClick={handlePlayClick}>
              <div className="relative group rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300  ">
                <img
                  src={gameInfo.imageUrl}
                  alt={`${gameInfo.title} cover`}
                  className="w-full h-64 md:h-[400px] object-cover transform transition-transform duration-300 group-hover:scale-105"
                />

                {/* Online Badge */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-1.5 flex items-center space-x-2 shadow-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div> {/* Green dot */}
                  <span className="text-sm font-medium text-gray-800">Online</span>
                </div>
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent" />
                {/* Play Icon Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-black/10 rounded-full p-4 backdrop-blur-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Section - Smaller */}
            <div className="lg:w-1/3 flex flex-col justify-center space-y-6">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">{gameInfo.title}</h1>
              <p className="text-gray-600 text-lg leading-relaxed">{gameInfo.metaDescription}</p>
              <div className="flex flex-col space-y-4">
                {/* Player Name Input */}
                <div className="flex flex-col space-y-2">
                  <label htmlFor="playerName" className="text-sm font-medium text-gray-700">
                    Your Player Name
                  </label>
                  <input
                    type="text"
                    id="playerName"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Enter your name"
                    maxLength={20}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
                <button
                  onClick={handlePlayClick}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 inline-block text-center shadow-lg hover:shadow-xl"
                >
                  Play Now →
                </button>
              </div>
            </div>
          </div>
          {/* Markdown Content */}
          <section className="w-full mb-12 bg-white p-4 md:p-8 rounded-2xl drop-shadow-sm border border-gray-200">
            <div className="prose max-w-none">
              <ReactMarkdown>{gameInfo.markdown}</ReactMarkdown>
            </div>
          </section>

          {/* Related Games */}
          <section className="w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 px-4 sm:px-0">More Games</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {gameData.map((game) => (
                <GameCard {...game} key={game.slug} />
              ))}
            </div>
          </section>
        </div>
      )}
    </>
  )
}
