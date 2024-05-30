import { EntityDestroyedEvent } from '../../../../../shared/component/events/EntityDestroyedEvent.js'
import { Entity } from '../../../../../shared/entity/Entity.js'
import { EntityManager } from '../../../../../shared/entity/EntityManager.js'
import { BaseEventSystem } from '../../../../../shared/system/EventSystem.js'
import { ChatMessageEvent } from '../../component/events/ChatMessageEvent.js'
import { PlayerComponent } from '../../component/tag/TagPlayerComponent.js'

export class DestroyEventSystem {
  update(entities: Entity[]) {
    const destroyedEvents = BaseEventSystem.getEventsByType(EntityDestroyedEvent)

    for (const destroyedEvent of destroyedEvents) {
      const entity = EntityManager.getEntityById(entities, destroyedEvent.entityId)
      if (!entity) {
        console.error('Update : DestroySystem: Entity not found with id', destroyedEvent.entityId)
        continue
      }

      if (entity.getComponent(PlayerComponent)) {
        BaseEventSystem.addEvent(
          new ChatMessageEvent(entity.id, '🖥️ [SERVER]', `Player ${entity.id} left the game.`)
        )
      }

      entity.removeAllComponents()
      EntityManager.removeEntityById(destroyedEvent.entityId)
    }
  }
}
