import { Hud } from '@/game/Hud'
import { MessageListComponent } from '@shared/component/MessageComponent'
import { Entity } from '@shared/entity/Entity'

export class ChatSystem {
  update(entities: Entity[], hud: Hud) {
    for (const entity of entities) {
      /**
       * When a message list component is updated
       * Update the state in the HUD (notification/chat)

       */
      const chatListComponent = entity.getComponent(MessageListComponent)
      if (chatListComponent && chatListComponent.updated) {
        if (hud.updateChat === undefined) {
          console.error('HUD not initialized for the ChatSystem.')
          return
        }

        // Pass only new messages instead of the entire list
        const newMessages = chatListComponent.list.slice()

        // Use updateChat with a callback to access previous messages
        hud.updateChat((prevMessages) => {
          // Filter out duplicate messages by comparing timestamps
          const uniqueNewMessages = newMessages.filter(
            (newMsg) => !prevMessages.some((prevMsg) => prevMsg.timestamp === newMsg.timestamp)
          )

          // Only add new messages if there are any
          if (uniqueNewMessages.length > 0) {
            // Limit front history to 250 messages
            const combinedMessages = [...prevMessages, ...uniqueNewMessages]
            return combinedMessages.slice(-250)
          }

          return prevMessages
        })
      }
    }
  }
}
