import {
  ChatListComponent,
  ChatMessageComponent,
} from "../../../../shared/component/ChatComponent.js";
import { Entity } from "../../../../shared/entity/Entity.js";
import { EntityManager } from "../../../../shared/entity/EntityManager.js";
import { SerializedEntityType } from "../../../../shared/network/server/serialized.js";
import { NetworkDataComponent } from "../component/NetworkDataComponent.js";

export class Chat {
  entity: Entity;

  constructor() {
    this.entity = EntityManager.getInstance().createEntity(
      SerializedEntityType.CHAT
    );

    const chatListComponent = new ChatListComponent(this.entity.id, []);
    this.entity.addComponent(chatListComponent);

    chatListComponent.addMessage("Server", "Welcome to the chat !");
    chatListComponent.addMessage("Server", new Date().toLocaleTimeString());

    const networkDataComponent = new NetworkDataComponent(
      this.entity.id,
      this.entity.type,
      [chatListComponent]
    );
    this.entity.addComponent(networkDataComponent);
  }
}
