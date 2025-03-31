import { SingleSizeComponent } from '../../../../../shared/component/SingleSizeComponent.js'
import { ComponentAddedEvent } from '../../../../../shared/component/events/ComponentAddedEvent.js'
import { Entity } from '../../../../../shared/entity/Entity.js'
import { EntityManager } from '../../../../../shared/system/EntityManager.js'
import { EventSystem } from '../../../../../shared/system/EventSystem.js'
import Rapier from '../../../physics/rapier.js'
import { CapsuleColliderComponent } from '../../component/physics/CapsuleColliderComponent.js'
import { ColliderPropertiesComponent } from '../../component/physics/ColliderPropertiesComponent.js'
import { DynamicRigidBodyComponent } from '../../component/physics/DynamicRigidBodyComponent.js'
import { KinematicRigidBodyComponent } from '../../component/physics/KinematicRigidBodyComponent.js'

export class CapsuleColliderSystem {
  async update(entities: Entity[], world: Rapier.World) {
    const createEvents = EventSystem.getEventsWrapped(ComponentAddedEvent, CapsuleColliderComponent)
    for (const event of createEvents) {
      const entity = EntityManager.getEntityById(entities, event.entityId)

      if (!entity) {
        console.error('CapsuleColliderSystem: Entity not found')
        continue
      }

      this.onComponentAdded(entity, event, world)
    }
  }

  onComponentAdded(
    entity: Entity,
    event: ComponentAddedEvent<CapsuleColliderComponent>,
    world: Rapier.World
  ) {
    // Collider
    const { component: capsuleColliderComponent } = event
    let sizeComponent = entity.getComponent(SingleSizeComponent)
    const rigidBodyComponent =
      entity.getComponent(DynamicRigidBodyComponent) ||
      entity.getComponent(KinematicRigidBodyComponent)

    if (!rigidBodyComponent) {
      console.error('CapsuleColliderSystem : No RigidBodyComponent found on entity.')
      return
    }

    if (!sizeComponent) {
      sizeComponent = new SingleSizeComponent(entity.id, 1)
      entity.addComponent(sizeComponent)

      console.warn(
        'CapsuleColliderSystem : No SizeComponent found on entity. Using a default size of 1.0.'
      )
    }

    const colliderDesc = Rapier.ColliderDesc.capsule(sizeComponent.size / 2, sizeComponent.size)
    // Set the friction combine rule to control how friction is combined with other contacts
    colliderDesc.setFrictionCombineRule(Rapier.CoefficientCombineRule.Max)
    // Set friction to control how slippery the player is when colliding with surfaces
    colliderDesc.setFriction(0.0) // Adjust the value as needed

    // Set restitution to control how bouncy the player is when colliding with surfaces
    // colliderDesc.setRestitution(0.0); // Adjust the value as needed

    // Set the restitution combine rule to control how restitution is combined with other contacts
    colliderDesc.setRestitutionCombineRule(Rapier.CoefficientCombineRule.Max)

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
    capsuleColliderComponent.collider = world.createCollider(colliderDesc, rigidBodyComponent.body)
  }
}
