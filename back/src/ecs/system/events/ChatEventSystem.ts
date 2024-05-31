import { EntityManager } from '../../../../../shared/system/EntityManager.js'
import { ChatListComponent } from '../../../../../shared/component/ChatComponent.js'
import { Entity } from '../../../../../shared/entity/Entity.js'
import { ChatMessageEvent } from '../../component/events/ChatMessageEvent.js'
import { ChatComponent } from '../../component/tag/TagChatComponent.js'
import { BaseEventSystem } from '../../../../../shared/system/EventSystem.js'

export class ChatEventSystem {
  private MAX_MESSAGES: number = 20
  private MAX_CONTENT_LENGTH: number = 128

  update(entities: Entity[]) {
    const chatMessageEvents = BaseEventSystem.getEvents(ChatMessageEvent)

    // Check if there are any chat messages to process
    if (chatMessageEvents.length === 0) {
      return
    }

    // Find Chat Entity
    // For now, we assume there is only one chat entity, but we could have multiple chat entities (local, group, etc)
    const chatEntity = EntityManager.getFirstEntityWithComponent(entities, ChatComponent)

    if (!chatEntity) {
      console.error('ChatEventSystem : A chat entity is required to send messages.')
      return
    }

    for (const chatMessageEvent of chatMessageEvents) {
      const chatListComponent = chatEntity.getComponent(ChatListComponent)
      if (chatListComponent) {
        let content = chatMessageEvent.content
        const sender = chatMessageEvent.sender

        // TODO : Create NameComponent and add it to the player entity
        // Limit history to maxMessages
        // Also, could send only the delta messages.

        if (chatListComponent.list.length >= this.MAX_MESSAGES) {
          chatListComponent.list.shift()
        }
        // Limit content length
        if (content.length > this.MAX_CONTENT_LENGTH) {
          content = content.substring(0, this.MAX_CONTENT_LENGTH)
        }

        chatListComponent.addMessage(sender, content)
      }
    }
  }
}
