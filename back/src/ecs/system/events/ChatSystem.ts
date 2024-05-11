import { EntityManager } from "../../../../../shared/entity/EntityManager.js";
import { ChatListComponent } from "../../../../../shared/component/ChatComponent.js";
import { Entity } from "../../../../../shared/entity/Entity.js";
import { EventChatMessage } from "../../component/events/EventChatMessage.js";
import { SerializedEntityType } from "../../../../../shared/network/server/serialized.js";

export class ChatSystem {
  private MAX_MESSAGES: number = 20;
  private MAX_CONTENT_LENGTH: number = 128;

  update(entities: Entity[], event: EventChatMessage) {
    // Find Chat Entity
    const chatEntity = EntityManager.getFirstEntityByType(
      entities,
      SerializedEntityType.CHAT
    );

    if (!chatEntity) {
      console.error("ChatSystem : Chat entity not found");
      return;
    }

    const chatListComponent = chatEntity.getComponent(ChatListComponent);
    if (chatListComponent) {
      let { content, entityId } = event;

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

      chatListComponent.addMessage(event.sender, event.content);
      return;
    }
  }
}
