import { BaseEventSystem } from '../../../../../shared/entity/EventSystem.js'
import { SingleSizeComponent } from '../../../../../shared/component/SingleSizeComponent.js'
import { Entity } from '../../../../../shared/entity/Entity.js'
import { EntityManager } from '../../../../../shared/entity/EntityManager.js'
import { SerializedEntityType } from '../../../../../shared/network/server/serialized.js'
import Rapier from '../../../physics/rapier.js'
import { ColliderComponent } from '../../component/physics/ColliderComponent.js'
import { SingleSizeEvent } from '../../component/events/SingleSizeEvent.js'

export class SingleSizeEventSystem {
  update(entities: Entity[]) {
    const eventSizes = BaseEventSystem.getEventsByType(SingleSizeEvent)

    for (const eventSingleSize of eventSizes) {
      const entity = EntityManager.getEntityById(entities, eventSingleSize.entityId)

      if (!entity) return

      const colliderComponent = entity.getComponent(ColliderComponent)

      if (!colliderComponent) return

      const singleSizeComponent = entity.getComponent(SingleSizeComponent)

      if (singleSizeComponent && eventSingleSize) {
        // TODO: Create a SphereComponent and EventSphere instead of relying on SerializedEntityType
        if (entity.type === SerializedEntityType.SPHERE) {
          const { size } = eventSingleSize
          singleSizeComponent.size = size

          let colliderDesc = Rapier.ColliderDesc.ball(size)
          colliderComponent.collider.setShape(colliderDesc.shape)

          // This will rebroadcast the update to all clients.
          singleSizeComponent.updated = true
        }
      }
    }
  }
}
