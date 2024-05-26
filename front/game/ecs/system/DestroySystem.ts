import { MeshComponent } from '../component/MeshComponent.js'
import { EntityManager } from '@shared/entity/EntityManager.js'
import { Renderer } from '@/game/renderer.js'
import { TextComponent } from '../component/TextComponent.js'
import { SerializedComponent } from '@shared/network/server/serialized.js'
import { EntityDestroyedEvent } from '@shared/component/events/EntityDestroyedEvent.js'
import { Entity } from '@shared/entity/Entity.js'
import { BaseEventSystem } from '@shared/system/EventSystem.js'

export class DestroySystem {
  update(entities: Entity[], renderer: Renderer) {
    const destroyedEvents = BaseEventSystem.getEventsByType(EntityDestroyedEvent)

    for (const destroyedEvent of destroyedEvents) {
      console.log('Destroying entity with id', destroyedEvent.entityId)
      const entity = EntityManager.getEntityById(entities, destroyedEvent.entityId)
      if (!entity) {
        console.error('Update : DestroySystem: Entity not found with id', destroyedEvent.entityId)
        continue
      }

      console.log('Destroying entity', entity)
      const meshComponent = entity.getComponent(MeshComponent)
      if (meshComponent) {
        renderer.scene.remove(meshComponent.mesh)
      }

      const textComponent = entity.getComponent(TextComponent)
      if (textComponent) {
        textComponent.textObject.element.remove()
      }

      // entity.removeAllComponents()
    }
  }
}
