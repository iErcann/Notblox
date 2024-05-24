import Rapier from '../../../physics/rapier.js'
import { SizeComponent } from '../../../../../shared/component/SizeComponent.js'
import { Entity } from '../../../../../shared/entity/Entity.js'
import { PhysicsColliderComponent } from '../../component/PhysicsColliderComponent.js'
import { SizeEvent } from '../../component/events/SizeEvent.js'
import { EntityManager } from '../../../../../shared/entity/EntityManager.js'
import { BaseEventSystem } from 'shared/entity/EventSystem.js'

export class SizeEventSystem {
  update(entities: Entity[]) {
    const eventSizes = BaseEventSystem.getEventsByType(SizeEvent)

    for (const eventSize of eventSizes) {
      const entity = EntityManager.getEntityById(entities, eventSize.entityId)

      if (!entity) return

      const colliderComponent = entity.getComponent(PhysicsColliderComponent)

      if (!colliderComponent) return

      const sizeComponent = entity.getComponent(SizeComponent)

      if (eventSize && sizeComponent) {
        // TODO: Check for cube here like the sphere
        const { width, height, depth } = eventSize
        sizeComponent.width = width
        sizeComponent.height = height
        sizeComponent.depth = depth

        let colliderDesc = Rapier.ColliderDesc.cuboid(width, height, depth)
        colliderComponent.collider.setShape(colliderDesc.shape)

        // This will rebroadcast the update to all clients.
        sizeComponent.updated = true
      }
    }
  }
}
