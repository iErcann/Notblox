import { MeshComponent } from '../component/MeshComponent.js'
import { EntityManager } from '@shared/system/EntityManager.js'
import { Renderer } from '@/game/renderer.js'
import { TextComponent } from '../component/TextComponent.js'
import { SerializedComponent } from '@shared/network/server/serialized.js'
import { EntityDestroyedEvent } from '@shared/component/events/EntityDestroyedEvent.js'
import { Entity } from '@shared/entity/Entity.js'
import { BaseEventSystem } from '@shared/system/EventSystem.js'

export class DestroySystem {
  update(entities: Entity[], renderer: Renderer) {
    const destroyedEvents = BaseEventSystem.getEvents(EntityDestroyedEvent)

    for (const destroyedEvent of destroyedEvents) {
      const entity = EntityManager.getEntityById(entities, destroyedEvent.entityId)
      if (!entity) {
        console.error('Update : DestroySystem: Entity not found with id', destroyedEvent.entityId)
        continue
      }

      const textComponent = entity.getComponent(TextComponent)
      if (textComponent) {
        textComponent.textObject.element.remove()
      }

      entity.removeAllComponents()
    }
  }
  afterUpdate(entities: Entity[]) {
    const destroyedEvents = BaseEventSystem.getEvents(EntityDestroyedEvent)

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
