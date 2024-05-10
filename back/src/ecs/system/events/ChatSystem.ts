import { ChatListComponent } from "../../../../../shared/component/ChatComponent.js";
import { Entity } from "../../../../../shared/entity/Entity.js";
import { EventChatMessage } from "../../component/events/EventChatMessage.js";

export class ChatSystem {
  update(entities: Entity[], event: EventChatMessage) {
    for (const entity of entities) {
      const chatListComponent = entity.getComponent(ChatListComponent);
      // If it has a chat ChatListComponent, then it is the chat entity (unique per game)
      if (chatListComponent) {
        // TODO : Create NameComponent and add it to the player entity
        const senderEntity = event.entity.id.toString();
        chatListComponent.addMessage(senderEntity, event.content);
        return;
      }
    }
  }
}
