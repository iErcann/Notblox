import { MeshComponent } from '../component/MeshComponent.js'
import { EntityManager } from '@shared/system/EntityManager.js'
import { Renderer } from '@/game/renderer.js'
import { TextComponent } from '../component/TextComponent.js'
import { SerializedComponent } from '@shared/network/server/serialized.js'
import { EntityDestroyedEvent } from '@shared/component/events/EntityDestroyedEvent.js'
import { Entity } from '@shared/entity/Entity.js'
import { EventSystem } from '@shared/system/EventSystem.js'
import { ComponentRemovedEvent } from '@shared/component/events/ComponentRemovedEvent'

export class MeshSystem {
  update(entities: Entity[], renderer: Renderer) {
    const destroyedMeshEvents = EventSystem.getEventsWrapped(ComponentRemovedEvent, MeshComponent)
    for (const destroyedEvent of destroyedMeshEvents) {
      const meshComponent = destroyedEvent.component as MeshComponent
      if (meshComponent) {
        console.log('destroyedEvent', destroyedEvent)
        renderer.scene.remove(meshComponent.mesh)
      }
    }
  }
}
