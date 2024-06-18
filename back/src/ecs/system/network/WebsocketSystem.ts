import {
  App,
  DEDICATED_COMPRESSOR_3KB,
  HttpRequest,
  HttpResponse,
  SSLApp,
  us_listen_socket,
  us_socket_context_t,
} from 'uWebSockets.js'
import { EntityDestroyedEvent } from '../../../../../shared/component/events/EntityDestroyedEvent.js'
import { ClientMessage, ClientMessageType } from '../../../../../shared/network/client/base.js'
import { ChatMessage } from '../../../../../shared/network/client/chatMessage.js'
import { InputMessage } from '../../../../../shared/network/client/input.js'
import { ConnectionMessage } from '../../../../../shared/network/server/connection.js'

import { unpack } from 'msgpackr'
import { ServerMessageType } from '../../../../../shared/network/server/base.js'
import { EventSystem } from '../../../../../shared/system/EventSystem.js'
import { ChatMessageEvent } from '../../component/events/ChatMessageEvent.js'
import { Player } from '../../entity/Player.js'
import { InputProcessingSystem } from '../InputProcessingSystem.js'
import { NetworkSystem } from './NetworkSystem.js'
import { RateLimiterMemory } from 'rate-limiter-flexible'

type MessageHandler = (ws: any, message: any) => void

export class WebsocketSystem {
  private port: number = 8001
  private players: Player[] = []
  private messageHandlers: Map<ClientMessageType, MessageHandler> = new Map()
  private inputProcessingSystem: InputProcessingSystem = new InputProcessingSystem()
  private limiter = new RateLimiterMemory({
    points: 10, // Max 10 points per second
    duration: 1, // Each point expires after 1 second
  })

  constructor() {
    this.initializeServer()
    this.initializeMessageHandlers()
  }
  private async isRateLimited(ip: string): Promise<boolean> {
    try {
      await this.limiter.consume(ip) // Use a unique identifier for each WebSocket connection
      return false // Not rate limited
    } catch (rejRes) {
      return true // Rate limited
    }
  }

  private initializeServer() {
    const isProduction = process.env.NODE_ENV === 'production'
    const acceptedOrigin: string | undefined = process.env.FRONTEND_URL
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
      upgrade: this.upgradeHandler.bind(this, isProduction, acceptedOrigin),
    })

    app.listen(this.port, this.listenHandler.bind(this))
  }

  private upgradeHandler(
    isProduction: boolean,
    acceptedOrigin: string | undefined,
    res: HttpResponse,
    req: HttpRequest,
    context: us_socket_context_t
  ) {
    // Only accept connections from the frontend
    const origin = req.getHeader('origin')
    if (isProduction && acceptedOrigin && origin !== acceptedOrigin) {
      res.writeStatus('403 Forbidden').end()
      return
    }

    res.upgrade(
      {}, // WebSocket handler will go here
      req.getHeader('sec-websocket-key'),
      req.getHeader('sec-websocket-protocol'),
      req.getHeader('sec-websocket-extensions'),
      context
    )
  }

  private listenHandler(listenSocket: us_listen_socket) {
    if (listenSocket) {
      console.log(`WebSocket server listening on port ${this.port}`)
    } else {
      console.error(`Failed to listen on port ${this.port}`)
    }
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

  private onMessage(ws: any, message: any) {
    const clientMessage: ClientMessage = unpack(message)
    const handler = this.messageHandlers.get(clientMessage.t)
    if (handler) {
      handler(ws, clientMessage)
    }
  }

  // TODO: Create EventOnPlayerConnect and EventOnPlayerDisconnect to respects ECS
  // Might be useful to query the chat and send a message to all players when a player connects or disconnects
  // Also could append scriptable events to be triggered on connect/disconnect depending on the game
  private async onConnect(ws: any) {
    const ipBuffer = ws.getRemoteAddressAsText() as ArrayBuffer
    const ip = Buffer.from(ipBuffer).toString()
    if (await this.isRateLimited(ip)) {
      // Respond to the client indicating that the connection is rate limited
      return ws.close(429, 'Rate limit exceeded')
    }
    const player = new Player(ws, 225, 111, -1008)
    const connectionMessage: ConnectionMessage = {
      t: ServerMessageType.FIRST_CONNECTION,
      id: player.entity.id,
    }
    // player.entity.addComponent(new RandomizeComponent(player.entity.id))
    ws.player = player
    ws.send(NetworkSystem.compress(connectionMessage), true)

    EventSystem.addEvent(
      new ChatMessageEvent(
        player.entity.id,
        '🖥️ [SERVER]',
        `Player ${player.entity.id} joined at ${new Date().toLocaleString()}`
      )
    )
    this.players.push(player)
  }

  private onDrain(ws: any) {
    console.log('WebSocket backpressure: ' + ws.getBufferedAmount())
  }

  private onClose(ws: any) {
    const disconnectedPlayer: Player = ws.player
    if (!disconnectedPlayer) {
      console.error('Disconnect: Player not found?', ws)
      return
    }

    console.log('Disconnect: Player found!')
    const entity = disconnectedPlayer.entity
    const entityId = entity.id

    EventSystem.addNetworkEvent(new EntityDestroyedEvent(entityId))
  }

  private async handleInputMessage(ws: any, message: InputMessage) {
    const player: Player = ws.player
    if (!player) {
      console.error(`Player with WS ${ws} not found.`)
      return
    }
    const { u: up, d: down, l: left, r: right, s: space, y: angleY } = message
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
    EventSystem.addEvent(new ChatMessageEvent(id, `Player ${id}`, content))
  }
}
