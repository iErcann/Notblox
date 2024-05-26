import { App, DEDICATED_COMPRESSOR_3KB, SSLApp } from 'uWebSockets.js'
import { EntityDestroyedEvent } from '../../../../../shared/component/events/EntityDestroyedEvent.js'
import { ClientMessage, ClientMessageType } from '../../../../../shared/network/client/base.js'
import { ChatMessage } from '../../../../../shared/network/client/chatMessage.js'
import { InputMessage } from '../../../../../shared/network/client/input.js'

import { pack, unpack } from 'msgpackr'
import { BaseEventSystem } from '../../../../../shared/system/EventSystem.js'
import { ServerMessageType } from '../../../../../shared/network/server/base.js'
import { ConnectionMessage } from '../../../../../shared/network/server/connection.js'
import { ChatMessageEvent } from '../../component/events/ChatMessageEvent.js'
import { Player } from '../../entity/Player.js'
import { InputProcessingSystem } from '../InputProcessingSystem.js'
import { Entity } from '../../../../../shared/entity/Entity.js'

type MessageHandler = (ws: any, message: any) => void

export class WebsocketSystem {
  private port: number = 8001
  private players: Player[] = []
  private messageHandlers: Map<ClientMessageType, MessageHandler> = new Map()
  private inputProcessingSystem: InputProcessingSystem = new InputProcessingSystem()

  constructor() {
    const isProduction = process.env.NODE_ENV === 'production'

    const app = isProduction
      ? SSLApp({
          key_file_name: '/etc/letsencrypt/live/npm-1/privkey.pem',
          cert_file_name: '/etc/letsencrypt/live/npm-1/cert.pem',
        })
      : App()

    app.ws('/*', {
      idleTimeout: 32,
      maxBackpressure: 1024,
      maxPayloadLength: 512,
      compression: DEDICATED_COMPRESSOR_3KB,
      message: this.onMessage.bind(this),
      open: this.onConnect.bind(this),
      drain: this.onDrain.bind(this),
      close: this.onClose.bind(this),
    })

    app.listen(this.port, (listenSocket: any) => {
      if (listenSocket) {
        console.log(`WebSocket server listening on port ${this.port}`)
      } else {
        console.error(`Failed to listen on port ${this.port}`)
      }
    })

    this.initializeMessageHandlers()
  }

  private initializeMessageHandlers() {
    this.addMessageHandler(ClientMessageType.INPUT, this.handleInputMessage.bind(this))
    this.addMessageHandler(ClientMessageType.CHAT_MESSAGE, this.handleChatMessage.bind(this))
  }

  private addMessageHandler(type: ClientMessageType, handler: MessageHandler) {
    this.messageHandlers.set(type, handler)
  }

  private removeMessageHandler(type: ClientMessageType) {
    this.messageHandlers.delete(type)
  }

  private onMessage(ws: any, message: any, isBinary: boolean) {
    const clientMessage: ClientMessage = unpack(message)
    const handler = this.messageHandlers.get(clientMessage.t)
    if (handler) {
      handler(ws, clientMessage)
    }
  }

  // TODO: Create EventOnPlayerConnect and EventOnPlayerDisconnect to respects ECS
  // Might be useful to query the chat and send a message to all players when a player connects or disconnects
  // Also could append scriptable events to be triggered on connect/disconnect depending on the game
  private onConnect(ws: any) {
    const player = new Player(ws, 10 + Math.random() * 3, 10, 20 + Math.random() * 3)
    const connectionMessage: ConnectionMessage = {
      t: ServerMessageType.FIRST_CONNECTION,
      id: player.entity.id,
    }
    ws.player = player
    ws.send(pack(connectionMessage), true)
    this.players.push(player)
  }

  private onDrain(ws: any) {
    console.log('WebSocket backpressure: ' + ws.getBufferedAmount())
  }

  private onClose(ws: any, code: number, message: any) {
    const disconnectedPlayer: Player = ws.player
    if (!disconnectedPlayer) {
      console.error('Disconnect: Player not found?', ws)
      return
    }

    console.log('Disconnect: Player found!')
    const entity = disconnectedPlayer.entity
    const entityId = entity.id

    BaseEventSystem.addNetworkEvent(new EntityDestroyedEvent(entityId))
  }

  private async handleInputMessage(ws: any, message: InputMessage) {
    const player: Player = ws.player
    if (!player) {
      console.error(`Player with WS ${ws} not found.`)
      return
    }
    const { up, down, left, right, space, angleY } = message
    if (
      typeof up !== 'boolean' ||
      typeof down !== 'boolean' ||
      typeof left !== 'boolean' ||
      typeof right !== 'boolean' ||
      typeof space !== 'boolean' ||
      typeof angleY !== 'number'
    ) {
      console.error('Invalid input message', message)
      return
    }

    this.inputProcessingSystem.receiveInputPacket(player.entity, message)
  }

  private handleChatMessage(ws: any, message: ChatMessage) {
    console.log('Chat message received', message)
    const player: Player = ws.player
    const id = player.entity.id

    const { content } = message
    if (!content || typeof content !== 'string') {
      console.error(`Invalid chat message, sent from ${player}`, message)
      return
    }
    BaseEventSystem.addEvent(new ChatMessageEvent(id, `Player ${id}`, content))
  }
}
