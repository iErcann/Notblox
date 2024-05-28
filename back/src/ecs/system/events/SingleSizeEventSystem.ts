import { BaseEventSystem } from '../../../../../shared/system/EventSystem.js'
import { SingleSizeComponent } from '../../../../../shared/component/SingleSizeComponent.js'
import { Entity } from '../../../../../shared/entity/Entity.js'
import { EntityManager } from '../../../../../shared/entity/EntityManager.js'
import { SerializedEntityType } from '../../../../../shared/network/server/serialized.js'
import Rapier from '../../../physics/rapier.js'
import { ColliderComponent } from '../../component/physics/ColliderComponent.js'
import { SingleSizeEvent } from '../../component/events/SingleSizeEvent.js'
import { BoxColliderComponent } from '../../component/physics/BoxColliderComponent.js'
import { SphereColliderComponent } from '../../component/physics/SphereColliderComponent.js'

export class SingleSizeEventSystem {
  update(entities: Entity[]) {
    const eventSizes = BaseEventSystem.getEventsByType(SingleSizeEvent)

    for (const eventSingleSize of eventSizes) {
      const entity = EntityManager.getEntityById(entities, eventSingleSize.entityId)

      if (!entity) continue
      // Request new size
      const { size: newSize } = eventSingleSize

      const singleSizeComponent = entity.getComponent(SingleSizeComponent)
      if (!singleSizeComponent) {
        console.error('SingleSizeComponent not found')
        continue
      }

      const boxColliderComponent = entity.getComponent(BoxColliderComponent)
      if (boxColliderComponent) {
        const colliderDesc = Rapier.ColliderDesc.cuboid(newSize, newSize, newSize)
        boxColliderComponent.collider?.setShape(colliderDesc.shape)
      }

      const sphereColliderComponent = entity.getComponent(SphereColliderComponent)
      if (sphereColliderComponent) {
        const colliderDesc = Rapier.ColliderDesc.ball(newSize)
        sphereColliderComponent.collider?.setShape(colliderDesc.shape)
      }

      // This will rebroadcast the update to all clients.
      if (singleSizeComponent) {
        singleSizeComponent.size = newSize
        singleSizeComponent.updated = true
      }
    }
  }
}
