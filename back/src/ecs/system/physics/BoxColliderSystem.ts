import { SizeComponent } from '../../../../../shared/component/SizeComponent.js'
import { ComponentAddedEvent } from '../../../../../shared/component/events/ComponentAddedEvent.js'
import { Entity } from '../../../../../shared/entity/Entity.js'
import { EntityManager } from '../../../../../shared/system/EntityManager.js'
import { EventSystem } from '../../../../../shared/system/EventSystem.js'
import Rapier from '../../../physics/rapier.js'
import { BoxColliderComponent } from '../../component/physics/BoxColliderComponent.js'
import { ColliderPropertiesComponent } from '../../component/physics/ColliderPropertiesComponent.js'
import { DynamicRigidBodyComponent } from '../../component/physics/DynamicRigidBodyComponent.js'
import { KinematicRigidBodyComponent } from '../../component/physics/KinematicRigidBodyComponent.js'

export class BoxColliderSystem {
  async update(entities: Entity[], world: Rapier.World) {
    const createEvents = EventSystem.getEventsWrapped(ComponentAddedEvent, BoxColliderComponent)
    for (const event of createEvents) {
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

    const colliderDesc = Rapier.ColliderDesc.cuboid(
      sizeComponent.width,
      sizeComponent.height,
      sizeComponent.depth
    )

    const colliderProperties = entity.getComponent(ColliderPropertiesComponent)

    if (colliderProperties) {
      if (colliderProperties.data.isSensor !== undefined) {
        colliderDesc.setSensor(colliderProperties.data.isSensor)
      }
      if (colliderProperties.data.friction !== undefined) {
        colliderDesc.setFriction(colliderProperties.data.friction)
      }
      if (colliderProperties.data.restitution !== undefined) {
        colliderDesc.setRestitution(colliderProperties.data.restitution)
      }
    }

    colliderDesc.setActiveEvents(Rapier.ActiveEvents.COLLISION_EVENTS)
    boxColliderComponent.collider = world.createCollider(colliderDesc, rigidBodyComponent.body)
  }
}
