import { SingleSizeComponent } from '../../../../../shared/component/SingleSizeComponent.js'
import { ComponentAddedEvent } from '../../../../../shared/component/events/ComponentAddedEvent.js'
import { Entity } from '../../../../../shared/entity/Entity.js'
import { EntityManager } from '../../../../../shared/system/EntityManager.js'
import { EventSystem } from '../../../../../shared/system/EventSystem.js'
import Rapier from '../../../physics/rapier.js'
import { ColliderPropertiesComponent } from '../../component/physics/ColliderPropertiesComponent.js'
import { DynamicRigidBodyComponent } from '../../component/physics/DynamicRigidBodyComponent.js'
import { KinematicRigidBodyComponent } from '../../component/physics/KinematicRigidBodyComponent.js'
import { SphereColliderComponent } from '../../component/physics/SphereColliderComponent.js'

export class SphereColliderSystem {
  async update(entities: Entity[], world: Rapier.World) {
    const createEvents = EventSystem.getEventsWrapped(ComponentAddedEvent, SphereColliderComponent)
    for (const event of createEvents) {
      const entity = EntityManager.getEntityById(entities, event.entityId)

      if (!entity) {
        console.error('SphereColliderSystem: Entity not found')
        continue
      }

      this.onComponentAdded(entity, event, world)
    }
  }

  onComponentAdded(
    entity: Entity,
    event: ComponentAddedEvent<SphereColliderComponent>,
    world: Rapier.World
  ) {
    const { component: sphereColliderComponent } = event
    let singleSizeComponent = entity.getComponent(SingleSizeComponent)
    const rigidBodyComponent =
      entity.getComponent(DynamicRigidBodyComponent) ||
      entity.getComponent(KinematicRigidBodyComponent)

    if (!rigidBodyComponent) {
      console.error('SphereColliderSystem : No RigidBodyComponent found on entity.')
      return
    }

    if (!singleSizeComponent) {
      singleSizeComponent = new SingleSizeComponent(entity.id, 1)
      entity.addComponent(singleSizeComponent)

      console.warn(
        'SphereColliderSystem : No SingleSizeComponent found on entity. Using a default size of 1.0.'
      )
    }

    const colliderDesc = Rapier.ColliderDesc.ball(singleSizeComponent.size)
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
    sphereColliderComponent.collider = world.createCollider(colliderDesc, rigidBodyComponent.body)
  }
}
