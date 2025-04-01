import { SerializedComponent, SerializedComponentType, SerializedMessageType } from '../network/server/serialized.js'
import { NetworkComponent } from '../network/NetworkComponent.js'

export class MessageComponent extends NetworkComponent {
  constructor(entityId: number, public message: SerializedMessageComponent) {
    super(entityId, SerializedComponentType.MESSAGE)
  }
  deserialize(data: SerializedMessageComponent) {
    this.message = data
  }
  serialize(): SerializedMessageComponent {
    return {
      content: this.message.content,
      author: this.message.author,
      type: this.message.type || SerializedMessageType.GLOBAL_CHAT,
      targetPlayerIds: this.message.targetPlayerIds || [],
    }
  }
}

export interface SerializedMessageComponent extends SerializedComponent {
  content: string
  author: string
  type?: SerializedMessageType
  targetPlayerIds?: number[]
}

export class MessageListComponent extends NetworkComponent {
  constructor(entityId: number, public list: MessageComponent[]) {
    super(entityId, SerializedComponentType.CHAT_LIST)
  }
  deserialize(data: SerializedMessageListComponent): void {
    console.log("Deserializing message list", data)
    this.list = data.messages.map((message) => new MessageComponent(this.entityId, message))
  }
  serialize(): SerializedMessageListComponent {
    console.log("Serializing message list", this.list)
    const messages = this.list.filter(message => message.updated).map((message) => message.serialize())
    return { messages }
  }
  // Add a message to the chat list with specified type and targets
  // messageType: GLOBAL_CHAT, TARGETED_CHAT, GLOBAL_NOTIFICATION, TARGETED_NOTIFICATION
  addMessage(author: string, content: string, messageType = SerializedMessageType.GLOBAL_CHAT, targetPlayerIds: number[] = []) {
    this.list.push(
      new MessageComponent(this.entityId, {
        author,
        content,
        type: messageType,
        targetPlayerIds
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
