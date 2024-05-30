import { unpack, pack } from 'msgpackr'
import { ServerMessage, ServerMessageType } from '@shared/network/server/base'
import { SnapshotMessage } from '@shared/network/server/serialized'
import { Game } from './game'
import { ConnectionMessage } from '@shared/network/server/connection'
import { ClientMessage } from '@shared/network/client/base'

import { isNativeAccelerationEnabled } from 'msgpackr'
import { EntityManager } from '@shared/entity/EntityManager'
import pako from 'pako'

if (!isNativeAccelerationEnabled)
  console.warn('Native acceleration not enabled, verify that install finished properly')

type MessageHandler = (message: ServerMessage) => void

export class WebSocketManager {
  private websocket: WebSocket | null = null
  private messageHandlers: Map<ServerMessageType, MessageHandler> = new Map()
  private serverUrl: string
  timeSinceLastServerUpdate: number = 0
  constructor(game: Game) {
    // Set the serverUrl based on the environment
    this.serverUrl = process.env.NEXT_PUBLIC_SERVER_URL ?? 'ws://localhost:8001'

    this.addMessageHandler(ServerMessageType.FIRST_CONNECTION, (message) => {
      const connectionMessage = message as ConnectionMessage
      game.currentPlayerEntityId = connectionMessage.id
      console.log('first connection', game.currentPlayerEntityId)
    })

    this.addMessageHandler(ServerMessageType.SNAPSHOT, (message) => {
      this.timeSinceLastServerUpdate = 0
      const snapshotMessage = message as SnapshotMessage
      game.syncComponentSystem.update(EntityManager.getInstance().getAllEntities(), snapshotMessage)
    })
  }

  async connect(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (!this.isConnected()) {
        this.websocket = new WebSocket(this.serverUrl)
        this.websocket.addEventListener('open', (event) => {
          console.log('WebSocket connection opened:', event)
          resolve() // Resolve the promise when the connection is open.
        })
        this.websocket.addEventListener('message', this.onMessage.bind(this))
        this.websocket.addEventListener('error', (errorEvent) => {
          console.error('WebSocket error:', errorEvent)
          reject(errorEvent) // Reject the promise on error.
        })
        this.websocket.addEventListener('close', (closeEvent) => {
          if (closeEvent.wasClean) {
            console.log(
              `WebSocket connection closed cleanly, code=${closeEvent.code}, reason=${closeEvent.reason}`
            )
          } else {
            console.error('WebSocket connection abruptly closed')
          }
        })
      } else {
        resolve() // WebSocket already exists, resolve without a value.
      }
    })
  }
  disconnect() {
    if (this.websocket) {
      this.websocket.close()
      this.websocket = null
    }
  }

  addMessageHandler(type: ServerMessageType, handler: MessageHandler) {
    this.messageHandlers.set(type, handler)
  }

  removeMessageHandler(type: ServerMessageType) {
    this.messageHandlers.delete(type)
  }

  private onOpen(event: Event) {
    console.log('WebSocket connection opened:', event)
  }

  send(message: ClientMessage) {
    if (this.isConnected()) {
      this.websocket!.send(pack(message))
    } else {
      console.error("Websocket doesnt exist can't send message", message)
    }
  }
  private isConnected(): boolean {
    return this.websocket != null && this.websocket.readyState === WebSocket.OPEN
  }

  private async onMessage(event: MessageEvent) {
    const buffer = await event.data.arrayBuffer()
    // Decompress the zlib first
    const decompressed = pako.inflate(buffer)
    // Then decompress the msgpackr
    const message: ServerMessage = unpack(decompressed)

    const handler = this.messageHandlers.get(message.t)
    if (handler) {
      handler(message)
    }
  }
}
