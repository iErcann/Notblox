import {
  SerializedComponent,
  SerializedComponentType,
} from "../network/server/serialized.js";

import { NetworkComponent } from "../network/NetworkComponent.js";

export class ChatMessageComponent extends NetworkComponent {
  constructor(
    entityId: number,
    public message: SerializedChatMessageComponent
  ) {
    super(entityId, SerializedComponentType.CHAT_MESSAGE);
  }
  deserialize(data: SerializedChatMessageComponent) {
    this.message = data;
  }
  serialize(): SerializedChatMessageComponent {
    return {
      content: this.message.content,
      author: this.message.author,
    };
  }
}

export interface SerializedChatMessageComponent extends SerializedComponent {
  content: string;
  author: string;
}

export class ChatListComponent extends NetworkComponent {
  constructor(
    entityId: number,
    public list: Array<ChatMessageComponent>,
    private maxMessages: number = 30,
    private maxContentLength: number = 128
  ) {
    super(entityId, SerializedComponentType.CHAT_LIST);
  }
  deserialize(data: SerializedChatListComponent): void {
    this.list = data.messages.map(
      (message) => new ChatMessageComponent(this.entityId, message)
    );
  }
  serialize(): SerializedChatListComponent {
    const messages = this.list.map((message) => message.serialize());
    return { messages };
  }

  // Only used by the server
  addMessage(author: string, content: string) {
    // Limit history to maxMessages
    // Also, could send only the delta messages.

    if (this.list.length >= this.maxMessages) {
      this.list.shift();
    }

    // Limit content length
    if (content.length > this.maxContentLength) {
      content = content.substring(0, this.maxContentLength);
    }

    this.list.push(
      new ChatMessageComponent(this.entityId, {
        author,
        content,
      })
    );

    // TODO: Only set update booleans of ChatMessageComponents
    // Updated set to true so new messages are sent to the clients.
    this.updated = true;
  }
}

export interface SerializedChatListComponent extends SerializedComponent {
  messages: SerializedChatMessageComponent[];
}
