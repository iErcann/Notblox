import { SizeComponent } from '../../../../../shared/component/SizeComponent.js'
import { Entity } from '../../../../../shared/entity/Entity.js'
import { EntityManager } from '../../../../../shared/system/EntityManager.js'
import { EventSystem } from '../../../../../shared/system/EventSystem.js'
import Rapier from '../../../physics/rapier.js'
import { SizeEvent } from '../../component/events/SizeEvent.js'
import { BoxColliderComponent } from '../../component/physics/BoxColliderComponent.js'

export class SizeEventSystem {
  update(entities: Entity[]) {
    const eventSizes = EventSystem.getEvents(SizeEvent)

    for (const eventSize of eventSizes) {
      const entity = EntityManager.getEntityById(entities, eventSize.entityId)

      if (!entity) continue
      // Request new size
      const { width, height, depth } = eventSize

      const sizeComponent = entity.getComponent(SizeComponent)
      if (!sizeComponent) {
        console.error('SizeComponent not found')
        continue
      }

      const boxColliderComponent = entity.getComponent(BoxColliderComponent)
      if (boxColliderComponent) {
        const colliderDesc = Rapier.ColliderDesc.cuboid(width, height, depth)
        boxColliderComponent.collider?.setShape(colliderDesc.shape)
      }

      // This will rebroadcast the update to all clients.
      if (sizeComponent) {
        sizeComponent.width = width
        sizeComponent.height = height
        sizeComponent.depth = depth
        sizeComponent.updated = true
      }
    }
  }
}
