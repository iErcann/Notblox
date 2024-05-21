import { SingleSizeComponent } from '../../../../../shared/component/SingleSizeComponent.js'
import { Entity } from '../../../../../shared/entity/Entity.js'
import { EntityManager } from '../../../../../shared/entity/EntityManager.js'
import { SerializedEntityType } from '../../../../../shared/network/server/serialized.js'
import Rapier from '../../../physics/rapier.js'
import { PhysicsColliderComponent } from '../../component/PhysicsColliderComponent.js'
import { EventSingleSize } from '../../component/events/EventSingleSize.js'

export class SyncSingleSizeSystem {
  update(entities: Entity[], eventSingleSize: EventSingleSize) {
    const entity = EntityManager.getEntityById(entities, eventSingleSize.entityId)

    if (!entity) return
    const colliderComponent = entity.getComponent(PhysicsColliderComponent)

    if (!colliderComponent) return
    const singleSizeComponent = entity.getComponent(SingleSizeComponent)

    if (singleSizeComponent && eventSingleSize) {
      // TODO: Create a SphereComponent and EventSphere instead of relying on SerializedEntityType
      if (entity.type === SerializedEntityType.SPHERE) {
        const { size } = eventSingleSize

        if (size <= 0) {
          console.error(`Invalid size value: ${size}`)
          return
        }

        singleSizeComponent.size = size

        let colliderDesc = Rapier.ColliderDesc.ball(size)
        colliderComponent.collider.setShape(colliderDesc.shape)

        // This will rebroadcast the update to all clients.
        singleSizeComponent.updated = true
      }
    }
  }
}
