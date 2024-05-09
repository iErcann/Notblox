import { Hud } from "@/game/hud";
import { ChatListComponent } from "@shared/component/ChatComponent";
import { Entity } from "@shared/entity/Entity";

export class ChatSystem {
  update(entities: Entity[], hud: Hud) {
    for (const entity of entities) {
      const chatListComponent = entity.getComponent(ChatListComponent);
      if (chatListComponent && chatListComponent.updated) {
        if (hud.updateChat === undefined) {
          console.error("HUD not initialized for the ChatSystem.");
          return;
        }

        hud.updateChat({ ...(chatListComponent as any) });
      }
    }
  }
}
