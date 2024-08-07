import { SerializedComponentType } from '../network/server/serialized.js';
import { NetworkComponent } from '../network/NetworkComponent.js';
export class ChatMessageComponent extends NetworkComponent {
    message;
    constructor(entityId, message) {
        super(entityId, SerializedComponentType.CHAT_MESSAGE);
        this.message = message;
    }
    deserialize(data) {
        this.message = data;
    }
    serialize() {
        return {
            content: this.message.content,
            author: this.message.author,
        };
    }
}
export class ChatListComponent extends NetworkComponent {
    list;
    constructor(entityId, list) {
        super(entityId, SerializedComponentType.CHAT_LIST);
        this.list = list;
    }
    deserialize(data) {
        this.list = data.messages.map((message) => new ChatMessageComponent(this.entityId, message));
    }
    serialize() {
        const messages = this.list.map((message) => message.serialize());
        return { messages };
    }
    // Only used by the server
    addMessage(author, content) {
        this.list.push(new ChatMessageComponent(this.entityId, {
            author,
            content,
        }));
        // TODO: Only set update booleans of ChatMessageComponents
        // Updated set to true so new messages are sent to the clients.
        this.updated = true;
    }
}
//# sourceMappingURL=ChatComponent.js.map