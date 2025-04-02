import {
  SerializedComponent,
  SerializedComponentType,
  SerializedMessageType,
} from '../network/server/serialized.js'
import { NetworkComponent } from '../network/NetworkComponent.js'

export class MessageComponent extends NetworkComponent {
  public author: string
  public content: string
  public messageType: SerializedMessageType
  public timestamp: number
  public targetPlayerIds: number[]

  constructor(entityId: number, message: SerializedMessageComponent) {
    super(entityId, SerializedComponentType.MESSAGE)
    this.author = message.a
    this.content = message.c
    this.messageType = message.mT
    this.timestamp = message.ts
    this.targetPlayerIds = message.tpIds || []
  }

  deserialize(data: SerializedMessageComponent) {
    this.author = data.a
    this.content = data.c
    this.messageType = data.mT
    this.timestamp = data.ts
    this.targetPlayerIds = data.tpIds || []
  }

  serialize(): SerializedMessageComponent {
    return {
      mT: this.messageType,
      c: this.content,
      a: this.author,
      ts: this.timestamp,
      tpIds: this.targetPlayerIds,
    }
  }
}

export interface SerializedMessageComponent extends SerializedComponent {
  // Message type
  mT: SerializedMessageType
  // Message content
  c: string
  // Author
  a: string
  // Creation Timestamp
  ts: number
  // Target player entity IDs
  tpIds?: number[]
}

export class MessageListComponent extends NetworkComponent {
  constructor(entityId: number, public list: MessageComponent[]) {
    super(entityId, SerializedComponentType.CHAT_LIST)
  }
  deserialize(data: SerializedMessageListComponent): void {
    this.list = data.messages.map((message) => new MessageComponent(this.entityId, message))
  }
  serialize(): SerializedMessageListComponent {
    const messages = this.list
      .filter((message) => message.updated)
      .map((message) => message.serialize())
    return { messages }
  }
  /**
   * Add a message to the chat list
   * @param author The name of the message sender
   * @param content The text content of the message
   * @param messageType The type of message (GLOBAL_CHAT, TARGETED_CHAT, GLOBAL_NOTIFICATION, TARGETED_NOTIFICATION)
   * @param targetPlayerIds Array of player IDs for targeted messages (only used when messageType is TARGETED_CHAT or TARGETED_NOTIFICATION)
   */
  addMessage(
    author: string,
    content: string,
    messageType = SerializedMessageType.GLOBAL_CHAT,
    targetPlayerIds: number[] = []
  ) {
    this.list.push(
      new MessageComponent(this.entityId, {
        a: author,
        c: content,
        mT: messageType,
        tpIds: targetPlayerIds,
        ts: Date.now(),
      })
    )

    // Updated set to true so new messages are sent to the clients.
    // TODO: Only set update booleans of MessageComponents
    this.updated = true
  }
}

export interface SerializedMessageListComponent extends SerializedComponent {
  messages: SerializedMessageComponent[]
}
