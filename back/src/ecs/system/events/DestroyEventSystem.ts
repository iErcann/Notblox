import { EntityDestroyedEvent } from '../../../../../shared/component/events/EntityDestroyedEvent.js'
import { Entity } from '../../../../../shared/entity/Entity.js'
import { EntityManager } from '../../../../../shared/system/EntityManager.js'
import { EventSystem } from '../../../../../shared/system/EventSystem.js'
import { MessageEvent } from '../../component/events/MessageEvent.js'
import { PlayerComponent } from '../../../../../shared/component/PlayerComponent.js'
import { SerializedMessageType } from '../../../../../shared/network/server/serialized.js'

// In DestroyEventSystem.ts
export class DestroyEventSystem {
  // Mark entities for destruction but don't remove them yet
  update(entities: Entity[]) {
    const destroyedEvents = EventSystem.getEvents(EntityDestroyedEvent)
    for (const destroyedEvent of destroyedEvents) {
      const entity = EntityManager.getEntityById(entities, destroyedEvent.entityId)
      if (!entity) {
        console.error('Update : DestroySystem: Entity not found with id', destroyedEvent.entityId)
        continue
      }

      // Send a message to all players when a player disconnects
      const playerComponent = entity.getComponent(PlayerComponent)
      if (playerComponent) {
        EventSystem.addEvent(
          new MessageEvent(
            entity.id,
            '🖥️ [SERVER]',
            `Player ${playerComponent.name} disconnected at ${new Date().toLocaleString()}`,
            SerializedMessageType.GLOBAL_CHAT
          )
        )
      }

      // This will create ComponentRemovedEvent for each component
      entity.removeAllComponents()
    }
  }

  // Actually remove the entities at the end of the update cycle
  afterUpdate(entities: Entity[]) {
    const destroyedEvents = EventSystem.getEvents(EntityDestroyedEvent)

    for (const destroyedEvent of destroyedEvents) {
      const entity = EntityManager.getEntityById(entities, destroyedEvent.entityId)
      if (!entity) {
        console.error('Update : DestroySystem: Entity not found with id', destroyedEvent.entityId)
        continue
      }

      EntityManager.removeEntity(entity)
    }
  }
}
