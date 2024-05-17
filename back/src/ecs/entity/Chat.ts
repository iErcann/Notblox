import {
  ChatListComponent,
  ChatMessageComponent,
} from '../../../../shared/component/ChatComponent.js'
import { Entity } from '../../../../shared/entity/Entity.js'
import { EntityManager } from '../../../../shared/entity/EntityManager.js'
import { SerializedEntityType } from '../../../../shared/network/server/serialized.js'
import { NetworkDataComponent } from '../component/NetworkDataComponent.js'
import { EventChatMessage } from '../component/events/EventChatMessage.js'
import { ChatComponent } from '../component/tag/ChatComponent.js'
import { EventSystem } from '../system/events/EventSystem.js'

export class Chat {
  entity: Entity

  constructor() {
    this.entity = EntityManager.getInstance().createEntity(SerializedEntityType.CHAT)

    this.entity.addComponent(new ChatComponent(this.entity.id))

    EventSystem.getInstance().addEvent(
      new EventChatMessage(this.entity.id, '🖥️ [SERVER]', `Started ${new Date().toLocaleString()}`)
    )

    EventSystem.getInstance().addEvent(
      new EventChatMessage(this.entity.id, '🖥️ [SERVER]', 'Welcome to the chat !')
    )

    const chatListComponent = new ChatListComponent(this.entity.id, [])
    this.entity.addComponent(chatListComponent)

    const networkDataComponent = new NetworkDataComponent(this.entity.id, this.entity.type, [
      chatListComponent,
    ])
    this.entity.addComponent(networkDataComponent)
  }
}
