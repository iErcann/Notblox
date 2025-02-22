import { EntityManager } from '@shared/system/EntityManager.js'
import { Renderer } from '@/game/Renderer.js'
import { EntityDestroyedEvent } from '@shared/component/events/EntityDestroyedEvent.js'
import { Entity } from '@shared/entity/Entity.js'
import { EventSystem } from '@shared/system/EventSystem.js'

export class DestroySystem {
  update(entities: Entity[], renderer: Renderer) {
    const destroyedEvents = EventSystem.getEvents(EntityDestroyedEvent)

    for (const destroyedEvent of destroyedEvents) {
      const entity = EntityManager.getEntityById(entities, destroyedEvent.entityId)
      if (!entity) {
        console.error('Update : DestroySystem: Entity not found with id', destroyedEvent.entityId)
        continue
      }

      entity.removeAllComponents()
    }
  }
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
