import { Entity } from '../../../../../shared/entity/Entity.js'
import Rapier from '../../../physics/rapier.js'
import { OnCollisionEnterComponent } from '../../component/OnCollisionEnterComponent.js'
import { OnCollisionExitComponent } from '../../component/OnCollisionExitComponent.js'
import { BoxColliderComponent } from '../../component/physics/BoxColliderComponent.js'
import { CapsuleColliderComponent } from '../../component/physics/CapsuleColliderComponent.js'
import { SphereColliderComponent } from '../../component/physics/SphereColliderComponent.js'

export class CollisionSystem {
  update(entities: Entity[], world: Rapier.World, eventQueue: Rapier.EventQueue) {
    // Create a mapping of handles to entities
    // TODO: Use a more efficient way to map handles to entities, this is a temporary solution
    const handleToEntityMap = new Map<number, Entity>()

    for (const entity of entities) {
      if (entity.getComponent(BoxColliderComponent)) {
        const handle = entity.getComponent(BoxColliderComponent)?.collider?.handle
        if (handle) {
          handleToEntityMap.set(handle, entity)
        }
      }

      if (entity.getComponent(SphereColliderComponent)) {
        const handle = entity.getComponent(SphereColliderComponent)?.collider?.handle
        if (handle) {
          handleToEntityMap.set(handle, entity)
        }
      }

      if (entity.getComponent(CapsuleColliderComponent)) {
        const handle = entity.getComponent(CapsuleColliderComponent)?.collider?.handle
        if (handle) {
          handleToEntityMap.set(handle, entity)
        }
      }
    }

    // console.log('handleToEntityMap', handleToEntityMap)

    // Handle collision events
    eventQueue.drainCollisionEvents((handle1, handle2, started) => {
      const entityFirst = handleToEntityMap.get(handle1)
      const entitySecond = handleToEntityMap.get(handle2)
      // console.log('entityFirst', entityFirst)
      // console.log('entitySecond', entitySecond)
      if (entityFirst && entitySecond) {
        if (started) {
          const onCollisionEnterFirst = entityFirst.getComponent(OnCollisionEnterComponent)
          if (onCollisionEnterFirst) {
            onCollisionEnterFirst.onCollisionEnter(entitySecond)
          }
          const onCollisionEnterSecond = entitySecond.getComponent(OnCollisionEnterComponent)
          if (onCollisionEnterSecond) {
            onCollisionEnterSecond.onCollisionEnter(entityFirst)
          }
        } else {
          const onCollisionExitFirst = entityFirst.getComponent(OnCollisionExitComponent)
          if (onCollisionExitFirst) {
            onCollisionExitFirst.onCollisionExit(entitySecond)
          }
          const onCollisionExitSecond = entitySecond.getComponent(OnCollisionExitComponent)
          if (onCollisionExitSecond) {
            onCollisionExitSecond.onCollisionExit(entityFirst)
          }
        }
      }
    })
  }
}
