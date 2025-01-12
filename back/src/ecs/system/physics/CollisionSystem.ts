import { Entity } from '../../../../../shared/entity/Entity.js'
import Rapier from '../../../physics/rapier.js'
import { OnCollisionEnterEvent } from '../../component/events/OnCollisionEnterEvent.js'
import { OnCollisionExitEvent } from '../../component/events/OnCollisionExitEvent.js'
import { BoxColliderComponent } from '../../component/physics/BoxColliderComponent.js'
import { CapsuleColliderComponent } from '../../component/physics/CapsuleColliderComponent.js'
import { ConvexHullColliderComponent } from '../../component/physics/ConvexHullColliderComponent.js'
import { SphereColliderComponent } from '../../component/physics/SphereColliderComponent.js'

export class CollisionSystem {
  update(entities: Entity[], world: Rapier.World, eventQueue: Rapier.EventQueue) {
    // Create a mapping of handles to entities
    // TODO: Use a more efficient way to map handles to entities, this is a temporary solution
    const handleToEntityMap = new Map<number, Entity>()

    for (const entity of entities) {
      const colliderTypes = [
        BoxColliderComponent,
        SphereColliderComponent,
        CapsuleColliderComponent,
        ConvexHullColliderComponent,
      ]

      for (const ColliderType of colliderTypes) {
        const handle = entity.getComponent(ColliderType)?.collider?.handle
        if (handle != null) {
          handleToEntityMap.set(handle, entity)
          break
        }
      }
    }

    // Handle collision events
    eventQueue.drainCollisionEvents((handle1, handle2, started) => {
      const entityFirst = handleToEntityMap.get(handle1)
      const entitySecond = handleToEntityMap.get(handle2)
      // console.log('entityFirst', entityFirst)
      // console.log('entitySecond', entitySecond)
      if (entityFirst && entitySecond) {
        if (started) {
          const onCollisionEnterFirst = entityFirst.getComponent(OnCollisionEnterEvent)
          if (onCollisionEnterFirst) {
            onCollisionEnterFirst.onCollisionEnter(entitySecond)
          }
          const onCollisionEnterSecond = entitySecond.getComponent(OnCollisionEnterEvent)
          if (onCollisionEnterSecond) {
            onCollisionEnterSecond.onCollisionEnter(entityFirst)
          }
        } else {
          const onCollisionExitFirst = entityFirst.getComponent(OnCollisionExitEvent)
          if (onCollisionExitFirst) {
            onCollisionExitFirst.onCollisionExit(entitySecond)
          }
          const onCollisionExitSecond = entitySecond.getComponent(OnCollisionExitEvent)
          if (onCollisionExitSecond) {
            onCollisionExitSecond.onCollisionExit(entityFirst)
          }
        }
      }
    })
  }
}
