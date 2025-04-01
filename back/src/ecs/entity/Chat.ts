import { MessageListComponent } from '../../../../shared/component/MessageComponent.js'
import { Entity } from '../../../../shared/entity/Entity.js'
import { EntityManager } from '../../../../shared/system/EntityManager.js'
import { EventSystem } from '../../../../shared/system/EventSystem.js'
import { SerializedEntityType } from '../../../../shared/network/server/serialized.js'
import { NetworkDataComponent } from '../../../../shared/network/NetworkDataComponent.js'
import { MessageEvent } from '../component/events/MessageEvent.js'
import { ChatComponent } from '../component/tag/TagChatComponent.js'

export class Chat {
  entity: Entity

  constructor() {
    this.entity = EntityManager.createEntity(SerializedEntityType.CHAT)

    this.entity.addComponent(new ChatComponent(this.entity.id))

    EventSystem.addEvent(
      new MessageEvent(this.entity.id, '🖥️ [SERVER]', `Started ${new Date().toLocaleString()}`)
    )

    EventSystem.addEvent(
      new MessageEvent(this.entity.id, '🖥️ [SERVER]', 'Welcome to the chat !')
    )

    const chatListComponent = new MessageListComponent(this.entity.id, [])
    this.entity.addComponent(chatListComponent)

    const networkDataComponent = new NetworkDataComponent(this.entity.id, this.entity.type, [
      chatListComponent,
    ])
    this.entity.addComponent(networkDataComponent)
  }
}
