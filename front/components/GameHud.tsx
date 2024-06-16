import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { Joystick } from 'react-joystick-component'
import { Maximize } from 'lucide-react'
import { ChatListComponent } from '@shared/component/ChatComponent'

export interface GameHudProps {
  chatList: ChatListComponent | undefined
  sendMessage: (message: string) => void
  gameInstance: any
}

export default function GameHud({ chatList, sendMessage, gameInstance }: GameHudProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const refContainer = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [chatList?.list])

  const handleFullscreenClick = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      refContainer.current?.requestFullscreen()
    }
  }

  return (
    <div
      id="hud"
      className="fixed inset-0 bg-gray-800 bg-opacity-0 text-white p-4 z-50 pointer-events-none"
      ref={refContainer}
    >
      <div className="flex justify-between items-center">
        <div className="shadow-4xl p-4 rounded-lg space-y-1 bg-gray-800 bg-opacity-20">
          <p className="text-sm">👋 Welcome to </p>
          <p className="text-sm md:text-2xl font-bold">
            NotBlox<span className="font-thin">.online</span>
          </p>
          <div className="space-x-4 text-sm">
            <Link className="pointer-events-auto" href="https://discord.gg/aEBXPtFwgU">
              Discord
            </Link>
            <Link className="pointer-events-auto" href="https://github.com/iErcann/Notblox">
              Source Code
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 right-4 bg-black bg-opacity-20 rounded-xl p-4 z-50 hidden lg:flex flex-col w-[360px] pointer-events-auto space-y-4">
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

      <div className="flex lg:hidden pointer-events-auto">
        <div className="absolute top-2 right-2">
          <button onClick={handleFullscreenClick} className="text-white hover:text-gray-300">
            <Maximize className="size-16" />
          </button>
        </div>
        <div className="absolute bottom-12 left-12">
          <Joystick
            size={100}
            baseColor="rgba(255, 255, 255, 0.5)"
            stickColor="rgba(255, 255, 255, 0.2)"
            move={(props) => gameInstance?.inputManager.handleJoystickMove(props)}
            stop={(props) => gameInstance?.inputManager.handleJoystickStop(props)}
          />
        </div>
        <div className="absolute bottom-12 right-12">
          <button
            className="bg-gray-500 bg-opacity-20 text-white font-bold py-4 px-8 rounded-full shadow-lg transition-transform transform hover:bg-gray-600 hover:bg-opacity-100 focus:bg-green-600 focus:bg-opacity-100 focus:outline-none active:translate-y-1 w-24 h-24 flex items-center justify-center"
            onTouchStart={() => gameInstance && (gameInstance.inputManager.inputState.s = true)}
            onMouseDown={() => gameInstance && (gameInstance.inputManager.inputState.s = true)}
            onTouchEnd={() => gameInstance && (gameInstance.inputManager.inputState.s = false)}
            onMouseOut={() => gameInstance && (gameInstance.inputManager.inputState.s = false)}
          >
            <span className="pointer-events-none">Jump</span>
          </button>
        </div>
      </div>
    </div>
  )
}
