import { EntityManager } from '../../../../../shared/system/EntityManager.js'
import { MessageListComponent } from '../../../../../shared/component/MessageComponent.js'
import { Entity } from '../../../../../shared/entity/Entity.js'
import { MessageEvent } from '../../component/events/MessageEvent.js'
import { ChatComponent } from '../../component/tag/TagChatComponent.js'
import { EventSystem } from '../../../../../shared/system/EventSystem.js'
import { SerializedMessageType } from '../../../../../shared/network/server/serialized.js'
import { config } from '../../../../../shared/network/config.js'

export class MessageEventSystem {
  private MAX_MESSAGES: number = 20

  update(entities: Entity[]) {
    const chatMessageEvents = EventSystem.getEvents(MessageEvent)

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
      const messageListComponent = chatEntity.getComponent(MessageListComponent)
      if (messageListComponent) {
        let content = chatMessageEvent.content
        const sender = chatMessageEvent.sender
        const messageType = chatMessageEvent.messageType
        const targetPlayerIds = chatMessageEvent.targetPlayerIds

        // Limit content length
        content = content.slice(0, config.MAX_MESSAGE_CONTENT_LENGTH)
        // Limit message history (bandwidth)
        if (messageListComponent.list.length >= this.MAX_MESSAGES) {
          messageListComponent.list.shift()
        }

        // Handle different message types
        /**
         * Those messages are broadcasted to everybody, and front end handles the targeting.
         */
        switch (messageType) {
          case SerializedMessageType.GLOBAL_NOTIFICATION:
            // Add global notification
            messageListComponent.addMessage(
              sender,
              content,
              SerializedMessageType.GLOBAL_NOTIFICATION
            )
            break

          case SerializedMessageType.TARGETED_NOTIFICATION:
          case SerializedMessageType.TARGETED_CHAT:
            // Check if we have valid target player IDs
            if (targetPlayerIds && targetPlayerIds.length > 0) {
              // Add targeted message with appropriate message type
              messageListComponent.addMessage(sender, content, messageType, targetPlayerIds)
            } else {
              console.warn(`ChatEventSystem: ${messageType} without target player IDs`)
              // Fall back to regular chat message
              messageListComponent.addMessage(sender, content, SerializedMessageType.GLOBAL_CHAT)
            }
            break

          case SerializedMessageType.GLOBAL_CHAT:
          default:
            // Regular chat message
            messageListComponent.addMessage(sender, content, SerializedMessageType.GLOBAL_CHAT)
            break
        }
      }
    }
  }
}
