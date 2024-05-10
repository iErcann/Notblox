// Binding react states - game

import { Dispatch, SetStateAction } from "react";
import { ChatListComponent } from "@shared/component/ChatComponent";

// Props drill
export class Hud {
  public updateChat:
    | Dispatch<SetStateAction<ChatListComponent | undefined>>
    | undefined;
  passChatState(
    updateChat: Dispatch<SetStateAction<ChatListComponent | undefined>>
  ) {
    // Update the type of setChat
    this.updateChat = updateChat;
  }

  public sendChatMessage(message: string) {}
}
