import Rapier from '../../../physics/rapier.js'
import { ComponentAddedEvent } from '../../../../../shared/component/events/ComponentAddedEvent.js'
import { Entity } from '../../../../../shared/entity/Entity.js'
import { EventSystem } from '../../../../../shared/system/EventSystem.js'
import { ComponentRemovedEvent } from '../../../../../shared/component/events/ComponentRemovedEvent.js'
import { EntityManager } from '../../../../../shared/system/EntityManager.js'
import { PositionComponent } from '../../../../../shared/component/PositionComponent.js'
import { DynamicRigidBodyComponent } from '../../component/physics/DynamicRigidBodyComponent.js'
import { PhysicsPropertiesComponent } from '../../component/physics/PhysicsPropertiesComponent.js'

export class DynamicRigidBodySystem {
  update(entities: Entity[], world: Rapier.World) {
    const createEvents = EventSystem.getEventsWrapped(
      ComponentAddedEvent,
      DynamicRigidBodyComponent
    )

    for (const event of createEvents) {
      const entity = EntityManager.getEntityById(entities, event.entityId)
      if (!entity) {
        console.error('DynamicRigidBodySystem: Entity not found')
        continue
      }
      this.onComponentAdded(entity, event, world)
    }

    const removedEvents = EventSystem.getEventsWrapped(
      ComponentRemovedEvent,
      DynamicRigidBodyComponent
    )

    for (const event of removedEvents) {
      this.onComponentRemoved(event, world)
    }
  }
  onComponentAdded(
    entity: Entity,
    event: ComponentAddedEvent<DynamicRigidBodyComponent>,
    world: Rapier.World
  ) {
    const physicsBodyComponent = event.component
    const rbDesc = Rapier.RigidBodyDesc.dynamic()

    const positionComponent = entity.getComponent(PositionComponent)
    const rigidBody = world.createRigidBody(rbDesc)

    if (positionComponent) {
      rigidBody.setTranslation(
        new Rapier.Vector3(positionComponent.x, positionComponent.y, positionComponent.z),
        false
      )
    }

    physicsBodyComponent.body = rigidBody
    const physicsPropertiesComponent = entity.getComponent(PhysicsPropertiesComponent)
    if (physicsPropertiesComponent) {
      if (physicsPropertiesComponent.data.mass !== undefined) {
        physicsBodyComponent.body.setAdditionalMass(physicsPropertiesComponent.data.mass, true)
      }
      if (physicsPropertiesComponent.data.angularDamping !== undefined) {
        physicsBodyComponent.body.setAngularDamping(physicsPropertiesComponent.data.angularDamping)
      }
      if (physicsPropertiesComponent.data.enableCcd != undefined) {
        physicsBodyComponent.body.enableCcd(physicsPropertiesComponent.data.enableCcd)
      }
      if (physicsPropertiesComponent.data.linearDamping !== undefined) {
        physicsBodyComponent.body.setLinearDamping(physicsPropertiesComponent.data.linearDamping)
      }
      if (physicsPropertiesComponent.data.gravityScale !== undefined) {
        physicsBodyComponent.body.setGravityScale(
          physicsPropertiesComponent.data.gravityScale,
          true
        )
      }
    }
  }

  // TODO: Check if we need to remove the colliders too.
  onComponentRemoved(event: ComponentRemovedEvent<DynamicRigidBodyComponent>, world: Rapier.World) {
    console.log('DynamicRigidBodySystem: Component removed')
    const physicsBodyComponent = event.component
    if (physicsBodyComponent.body) {
      world.removeRigidBody(physicsBodyComponent.body)
    }
  }
}
