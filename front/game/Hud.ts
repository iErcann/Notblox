// Binding react states - game

import { Dispatch, SetStateAction } from 'react'
import { MessageListComponent } from '@shared/component/MessageComponent'
import { Game } from './Game'
import { ClientMessageType } from '@shared/network/client/base'
import { ChatMessage } from '@shared/network/client/chatMessage'

// Props drill
export class Hud {
  updateChat: Dispatch<SetStateAction<MessageListComponent | undefined>> | undefined
  passChatState(updateChat: Dispatch<SetStateAction<MessageListComponent | undefined>>) {
    // Update the type of setChat
    this.updateChat = updateChat
  }

  sendMessageToServer(message: string) {
    if (message === '') return
    console.log('Sending message to server:', message)
    const chatMessage: ChatMessage = {
      t: ClientMessageType.CHAT_MESSAGE,
      content: message,
    }
    Game.getInstance().websocketManager.send(chatMessage)
  }
}
