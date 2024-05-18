// Binding react states - game

import { Dispatch, SetStateAction } from 'react'
import { ChatListComponent, ChatMessageComponent } from '@shared/component/ChatComponent'
import { Game } from './game'
import { ClientMessageType } from '@shared/network/client/base'
import { ChatMessage } from '@shared/network/client/chatMessage'

// Props drill
export class Hud {
  updateChat: Dispatch<SetStateAction<ChatListComponent | undefined>> | undefined
  passChatState(updateChat: Dispatch<SetStateAction<ChatListComponent | undefined>>) {
    // Update the type of setChat
    this.updateChat = updateChat
  }

  sendMessageToServer(message: string) {
    if (message === '') return
    console.log('Sending message to server:', message)
    const chatMessage: any = {
      t: ClientMessageType.CHAT_MESSAGE,
      content: message,
    }
    Game.getInstance().websocketManager.send(chatMessage)
  }
}
