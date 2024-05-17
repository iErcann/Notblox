import { MeshComponent } from '../component/MeshComponent.js'
import { EntityManager } from '@shared/entity/EntityManager.js'
import { Renderer } from '@/game/renderer.js'
import { TextComponent } from '../component/TextComponent.js'
import { SerializedComponent } from '@shared/network/server/serialized.js'
import { EventDestroyed } from '@shared/component/events/EventDestroyed.js'
import { Entity } from '@shared/entity/Entity.js'

export class DestroySystem {
  update(entities: Entity[], entityManager: EntityManager, renderer: Renderer) {
    for (const entity of entities) {
      const destroyComponent = entity.getComponent(EventDestroyed)

      if (destroyComponent) {
        console.log('DestroySystem: update: destroyComponent', destroyComponent)
        const meshComponent = entity.getComponent(MeshComponent)
        if (meshComponent) {
          renderer.scene.remove(meshComponent.mesh)
        }

        const textComponent = entity.getComponent(TextComponent)
        if (textComponent) {
          textComponent.textObject.element.remove()
        }

        entityManager.removeEntity(entity)
      }
    }
  }
}

export interface SerializedDestroyedComponent extends SerializedComponent {}
