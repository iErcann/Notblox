import { ChatListComponent } from '@shared/component/ChatComponent'
import { Github } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useRef } from 'react'

export interface GameHudProps {
  chatList: ChatListComponent | undefined
  sendMessage: (message: string) => void
}
export default function GameHud({ chatList, sendMessage }: GameHudProps) {
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    if (messagesEndRef.current)
      (messagesEndRef.current as any).scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [chatList?.list])
  return (
    <div
      id="hud"
      className="fixed inset-0 bg-gray-800 bg-opacity-0 text-white p-4 z-50 pointer-events-none"
    >
      <div className="flex justify-between items-center ">
        <div className="flex items-center space-x-4">
          <div>
            <p className="text-sm">Health:</p>
            <div className="h-4 w-48 bg-red-500 rounded-full overflow-hidden">
              <div className="h-full bg-red-700" style={{ width: '75%' }} />
            </div>
          </div>
          <div>
            <p className="text-sm">Score:</p>
            <p className="text-lg font-bold">00000</p>
          </div>
        </div>
        <div className="shadow-4xl p-4 rounded-lg space-y-1 bg-gray-800 bg-opacity-20">
          <p className="text-sm">👋 Welcome to </p>
          <p className="text-sm md:text-2xl font-bold">NotBlox.Online</p>
          <div className="space-x-4 text-sm">
            <Link className="pointer-events-auto" href={'https://discord.gg/aEBXPtFwgU'}>
              Discord
            </Link>
            <Link className="pointer-events-auto" href={'https://github.com/iErcann/Notblox'}>
              Source Code
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 right-4 bg-black bg-opacity-20 rounded-xl p-4 z-50 hidden md:flex flex-col w-[360px] pointer-events-auto space-y-4">
        {/* Chat messages */}
        <div className="overflow-y-auto max-h-64 h-64 space-y-2 pr-2">
          {chatList?.list.map((message, index) => (
            <div key={index} ref={messagesEndRef}>
              <div className="bg-gray-700 bg-opacity-30 rounded-lg p-2">
                <p className="text-sm">
                  <span className="font-medium">{message.message.author}</span>:{' '}
                  {message.message.content}
                </p>
              </div>
            </div>
          ))}
        </div>
        {/* Chat input */}
        <input
          type="text"
          placeholder="Type your message..."
          className="p-2 bg-black bg-opacity-20 text-white rounded-lg"
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') {
              sendMessage(e.currentTarget.value)
              e.currentTarget.value = ''
            }
          }}
        />
      </div>
    </div>
  )
}
