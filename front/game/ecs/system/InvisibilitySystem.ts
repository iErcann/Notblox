import { Entity } from '@shared/entity/Entity.js'
import { InvisibleComponent } from '@shared/component/InvisibleComponent.js'
import { MeshComponent } from '../component/MeshComponent.js'
import { EventSystem } from '@shared/system/EventSystem.js'
import { ComponentAddedEvent } from '@shared/component/events/ComponentAddedEvent.js'
import { ComponentRemovedEvent } from '@shared/component/events/ComponentRemovedEvent.js'
import { EntityManager } from '@shared/system/EntityManager.js'

/**
 * On InvisibleComponent added, make the entity invisible
 * On InvisibleComponent removed, make the entity visible again
 */
export class InvisibilitySystem {
  update(entities: Entity[]): void {
    // Handle added invisible components
    const addedInvisibleEvents = EventSystem.getEventsWrapped(
      ComponentAddedEvent,
      InvisibleComponent
    )
    for (const addedEvent of addedInvisibleEvents) {
      const entity = EntityManager.getEntityById(entities, addedEvent.entityId)
      if (entity) {
        const meshComponent = entity.getComponent(MeshComponent)
        if (meshComponent) {
          meshComponent.mesh.visible = false
        }
      }
    }

    // Handle removed invisible components
    const removedInvisibleEvents = EventSystem.getEventsWrapped(
      ComponentRemovedEvent,
      InvisibleComponent
    )
    for (const removedEvent of removedInvisibleEvents) {
      const entity = EntityManager.getEntityById(entities, removedEvent.entityId)
      if (entity) {
        const meshComponent = entity.getComponent(MeshComponent)
        if (meshComponent) {
          meshComponent.mesh.visible = true
        }
      }
    }
  }
}
