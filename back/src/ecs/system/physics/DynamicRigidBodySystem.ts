import Rapier from '../../../physics/rapier.js'
import { ComponentAddedEvent } from '../../../../../shared/component/events/ComponentAddedEvent.js'
import { Entity } from '../../../../../shared/entity/Entity.js'
import { BaseEventSystem } from '../../../../../shared/entity/EventSystem.js'
import { TrimeshCollidersComponent } from '../../component/physics/TrimeshColliderComponent.js'
import { ComponentRemovedEvent } from '../../../../../shared/component/events/ComponentRemovedEvent.js'
import { EntityManager } from '../../../../../shared/entity/EntityManager.js'
import { PositionComponent } from '../../../../../shared/component/PositionComponent.js'
import { DynamicRigidBodyComponent } from '../../component/physics/DynamicRigidBodyComponent.js'

export class DynamicRigidBodySystem {
  update(entities: Entity[], world: Rapier.World) {
    const createEvents = BaseEventSystem.getEventsWrapped(
      ComponentAddedEvent,
      DynamicRigidBodyComponent
    )

    for (let event of createEvents) {
      const entity = EntityManager.getEntityById(entities, event.entityId)
      if (!entity) {
        console.error('DynamicRigidBodySystem: Entity not found')
        continue
      }
      this.onComponentAdded(entity, event, world)
    }

    const removedEvents = BaseEventSystem.getEventsWrapped(
      ComponentRemovedEvent,
      DynamicRigidBodyComponent
    )

    for (let event of removedEvents) {
      this.onComponentRemoved(event, world)
    }
  }
  onComponentAdded(
    entity: Entity,
    event: ComponentAddedEvent<DynamicRigidBodyComponent>,
    world: Rapier.World
  ) {
    const physicsBodyComponent = event.component
    const dynamic = Rapier.RigidBodyDesc.dynamic()

    const positionComponent = entity.getComponent(PositionComponent)
    const rigidBody = world.createRigidBody(dynamic)

    if (positionComponent) {
      rigidBody.setTranslation(
        new Rapier.Vector3(positionComponent.x, positionComponent.y, positionComponent.z),
        false
      )
    }

    physicsBodyComponent.body = rigidBody
  }

  // TODO: Check if we need to remove the colliders too.
  onComponentRemoved(event: ComponentAddedEvent<DynamicRigidBodyComponent>, world: Rapier.World) {
    const physicsBodyComponent = event.component
    if (physicsBodyComponent.body) {
      world.removeRigidBody(physicsBodyComponent.body)
    }
  }
}
