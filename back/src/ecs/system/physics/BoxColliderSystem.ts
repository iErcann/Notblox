import Rapier from '../../../physics/rapier.js'
import { ComponentAddedEvent } from '../../../../../shared/component/events/ComponentAddedEvent.js'
import { Entity } from '../../../../../shared/entity/Entity.js'
import { BaseEventSystem } from '../../../../../shared/system/EventSystem.js'
import { KinematicRigidBodyComponent } from '../../component/physics/KinematicRigidBodyComponent.js'
import { TrimeshCollidersComponent } from '../../component/physics/TrimeshColliderComponent.js'
import { ComponentRemovedEvent } from '../../../../../shared/component/events/ComponentRemovedEvent.js'
import { EntityManager } from '../../../../../shared/entity/EntityManager.js'
import { SizeComponent } from '../../../../../shared/component/SizeComponent.js'
import { DynamicRigidBodyComponent } from '../../component/physics/DynamicRigidBodyComponent.js'
import { BoxColliderComponent } from '../../component/physics/BoxColliderComponent.js'

export class BoxColliderSystem {
  async update(entities: Entity[], world: Rapier.World) {
    const createEvents = BaseEventSystem.getEventsWrapped(ComponentAddedEvent, BoxColliderComponent)
    for (let event of createEvents) {
      const entity = EntityManager.getEntityById(entities, event.entityId)

      if (!entity) {
        console.error('BoxColliderSystem: Entity not found')
        continue
      }

      this.onComponentAdded(entity, event, world)
    }
  }

  onComponentAdded(
    entity: Entity,
    event: ComponentAddedEvent<BoxColliderComponent>,
    world: Rapier.World
  ) {
    // Collider
    const { component: boxColliderComponent } = event
    let sizeComponent = entity.getComponent(SizeComponent)
    const rigidBodyComponent =
      entity.getComponent(DynamicRigidBodyComponent) ||
      entity.getComponent(KinematicRigidBodyComponent)

    if (!rigidBodyComponent) {
      console.error('BoxColliderSystem : No RigidBodyComponent found on entity.')
      return
    }

    if (!sizeComponent) {
      sizeComponent = new SizeComponent(entity.id, 1, 1, 1)
      entity.addComponent(sizeComponent)

      console.warn(
        'BoxColliderSystem : No SizeComponent found on entity. Using a default size of 1.0.'
      )
    }

    let colliderDesc = Rapier.ColliderDesc.cuboid(
      sizeComponent.width,
      sizeComponent.height,
      sizeComponent.depth
    )
    boxColliderComponent.collider = world.createCollider(colliderDesc, rigidBodyComponent.body)
  }
}
