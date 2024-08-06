import { EntityManager } from '../../../../../shared/system/EntityManager.js';
import { ChatListComponent } from '../../../../../shared/component/ChatComponent.js';
import { ChatMessageEvent } from '../../component/events/ChatMessageEvent.js';
import { ChatComponent } from '../../component/tag/TagChatComponent.js';
import { EventSystem } from '../../../../../shared/system/EventSystem.js';
export class ChatEventSystem {
    MAX_MESSAGES = 20;
    MAX_CONTENT_LENGTH = 128;
    update(entities) {
        const chatMessageEvents = EventSystem.getEvents(ChatMessageEvent);
        // Check if there are any chat messages to process
        if (chatMessageEvents.length === 0) {
            return;
        }
        // Find Chat Entity
        // For now, we assume there is only one chat entity, but we could have multiple chat entities (local, group, etc)
        const chatEntity = EntityManager.getFirstEntityWithComponent(entities, ChatComponent);
        if (!chatEntity) {
            console.error('ChatEventSystem : A chat entity is required to send messages.');
            return;
        }
        for (const chatMessageEvent of chatMessageEvents) {
            const chatListComponent = chatEntity.getComponent(ChatListComponent);
            if (chatListComponent) {
                let content = chatMessageEvent.content;
                const sender = chatMessageEvent.sender;
                // TODO : Create NameComponent and add it to the player entity
                // Limit history to maxMessages
                // Also, could send only the delta messages.
                if (chatListComponent.list.length >= this.MAX_MESSAGES) {
                    chatListComponent.list.shift();
                }
                // Limit content length
                if (content.length > this.MAX_CONTENT_LENGTH) {
                    content = content.substring(0, this.MAX_CONTENT_LENGTH);
                }
                chatListComponent.addMessage(sender, content);
            }
        }
    }
}
//# sourceMappingURL=ChatEventSystem.js.map