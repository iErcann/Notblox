import { Hud } from '@/game/Hud'
import { MessageListComponent } from '@shared/component/MessageComponent'
import { Entity } from '@shared/entity/Entity'

/**
 * ChatSystem handles the synchronization of messages between the server and client.
 * It's responsible for merging new messages from the server with the existing client-side message history.
 */
export class ChatSystem {
  /**
   * Updates the chat system by processing new messages from the server and merging them with the existing client history.
   */
  update(entities: Entity[], hud: Hud) {
    for (const entity of entities) {
      /**
       * Message Flow Architecture:
       *
       * SERVER SIDE:
       * 1. Message Creation:
       *    - Messages are created through MessageEvent events (chat messages, notifications)
       *    - MessageEventSystem processes these events and adds them to a MessageListComponent
       *    - The component MessageListComponent is marked as 'updated' when new messages are added
       *
       * 2. Network Transmission:
       *    - MessageListComponent is serialized in the snapshot message
       *    - Only the most recent messages are sent to save bandwidth (e.g 20 messages)
       *
       * CLIENT SIDE:
       * 3. Message Reception & Processing:
       *    - This system receives the MessageListComponent from network snapshots
       *    - New messages are merged with existing client-side history
       *    - Duplicate messages are filtered using timestamp as unique identifier
       *    - Message history is capped at 250 messages to prevent memory issues
       *
       * 4. UI Rendering:
       *    - The merged messages are passed to GameHud component via Hud props
       *    - Messages are filtered by type (chat vs. notification) and target
       *    - Global and targeted notifications are displayed at the top of the screen
       *    - Chat messages appear in the chat window
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
