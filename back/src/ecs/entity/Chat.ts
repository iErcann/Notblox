import { ChatListComponent } from '../../../../shared/component/ChatComponent.js'
import { Entity } from '../../../../shared/entity/Entity.js'
import { EntityManager } from '../../../../shared/entity/EntityManager.js'
import { BaseEventSystem } from '../../../../shared/entity/EventSystem.js'
import { SerializedEntityType } from '../../../../shared/network/server/serialized.js'
import { NetworkDataComponent } from '../../../../shared/component/NetworkDataComponent.js'
import { ChatMessageEvent } from '../component/events/ChatMessageEvent.js'
import { ChatComponent } from '../component/tag/TagChatComponent.js'

export class Chat {
  entity: Entity

  constructor() {
    this.entity = EntityManager.getInstance().createEntity(SerializedEntityType.CHAT)

    this.entity.addComponent(new ChatComponent(this.entity.id))

    BaseEventSystem.addEvent(
      new ChatMessageEvent(this.entity.id, '🖥️ [SERVER]', `Started ${new Date().toLocaleString()}`)
    )

    BaseEventSystem.addEvent(
      new ChatMessageEvent(this.entity.id, '🖥️ [SERVER]', 'Welcome to the chat !')
    )

    const chatListComponent = new ChatListComponent(this.entity.id, [])
    this.entity.addComponent(chatListComponent)

    const networkDataComponent = new NetworkDataComponent(this.entity.id, this.entity.type, [
      chatListComponent,
    ])
    this.entity.addComponent(networkDataComponent)
  }
}
