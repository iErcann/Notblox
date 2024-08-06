import Rapier from '../../../physics/rapier.js'
import { ComponentAddedEvent } from '../../../../../shared/component/events/ComponentAddedEvent.js'
import { Entity } from '../../../../../shared/entity/Entity.js'
import { EventSystem } from '../../../../../shared/system/EventSystem.js'
import { ComponentRemovedEvent } from '../../../../../shared/component/events/ComponentRemovedEvent.js'
import { EntityManager } from '../../../../../shared/system/EntityManager.js'
import { DynamicRigidBodyComponent } from '../../component/physics/DynamicRigidBodyComponent.js'
import { LockedRotationComponent } from '../../component/LockedRotationComponent.js'

export class LockRotationSystem {
  update(entities: Entity[]) {
    const createEvents = EventSystem.getEventsWrapped(ComponentAddedEvent, LockedRotationComponent)

    for (const event of createEvents) {
      const entity = EntityManager.getEntityById(entities, event.entityId)
      if (!entity) {
        console.error('LockRotationSystem: Entity not found')
        continue
      }
      this.onRotationLocked(entity)
    }

    const removedEvents = EventSystem.getEventsWrapped(
      ComponentRemovedEvent,
      LockedRotationComponent
    )

    for (const event of removedEvents) {
      const entity = EntityManager.getEntityById(entities, event.entityId)
      if (!entity) {
        console.error('LockRotationSystem: Entity not found')
        continue
      }
      this.onRotationUnlocked(entity)
    }
  }
  getDynamicBodyComponent(entity: Entity) {
    const dynamicBodyComponent = entity.getComponent(DynamicRigidBodyComponent)
    if (!dynamicBodyComponent) {
      console.error('LockRotationSystem: Entity does not have a DynamicRigidBodyComponent')
      return null
    }
    if (!dynamicBodyComponent.body) {
      console.error('LockRotationSystem: Entity does not have a body')
      return null
    }
    return dynamicBodyComponent
  }
  onRotationLocked(entity: Entity) {
    const dynamicBodyComponent = this.getDynamicBodyComponent(entity)
    if (dynamicBodyComponent && dynamicBodyComponent.body) {
      dynamicBodyComponent.body.setLinvel(new Rapier.Vector3(0, 0, 0), true)
      dynamicBodyComponent.body.setAngvel(new Rapier.Vector3(0, 0, 0), true)
      dynamicBodyComponent.body.setEnabledRotations(false, false, false, true)
    }
  }

  onRotationUnlocked(entity: Entity) {
    const dynamicBodyComponent = this.getDynamicBodyComponent(entity)
    if (dynamicBodyComponent && dynamicBodyComponent.body) {
      dynamicBodyComponent.body.setEnabledRotations(true, true, true, true)
    }
  }
}
