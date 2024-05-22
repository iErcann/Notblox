import { EntityManager } from '../../../../../shared/entity/EntityManager.js'
import { ChatListComponent } from '../../../../../shared/component/ChatComponent.js'
import { Entity } from '../../../../../shared/entity/Entity.js'
import { ChatMessageEvent } from '../../component/events/ChatMessageEvent.js'
import { SerializedEntityType } from '../../../../../shared/network/server/serialized.js'
import { ChatComponent } from '../../component/tag/TagChatComponent.js'

export class ChatSystem {
  private MAX_MESSAGES: number = 20
  private MAX_CONTENT_LENGTH: number = 128

  update(entities: Entity[], event: ChatMessageEvent) {
    // Find Chat Entity
    const chatEntity = EntityManager.getFirstEntityWithComponent(entities, ChatComponent)

    if (!chatEntity) {
      console.error('ChatSystem : A chat entity is required to send messages.')
      return
    }

    const chatListComponent = chatEntity.getComponent(ChatListComponent)
    if (chatListComponent) {
      let { content, sender } = event

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
      return
    }
  }
}
