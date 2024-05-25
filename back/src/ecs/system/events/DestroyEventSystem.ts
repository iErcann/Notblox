import { Entity } from '../../../../../shared/entity/Entity.js'
import { EntityDestroyedEvent } from '../../../../../shared/component/events/EntityDestroyedEvent.js'
import { EntityManager } from '../../../../../shared/entity/EntityManager.js'
import { NetworkDataComponent } from '../../../../../shared/component/NetworkDataComponent.js'
import { WebSocketComponent } from '../../component/WebsocketComponent.js'
import { PhysicsSystem } from '../physics/PhysicsSystem.js'
import { SerializedEntityType } from '../../../../../shared/network/server/serialized.js'
import { ChatMessageEvent } from '../../component/events/ChatMessageEvent.js'
import { PlayerComponent } from '../../component/tag/TagPlayerComponent.js'
import { BaseEventSystem } from '../../../../../shared/entity/EventSystem.js'
import { KinematicRigidBodyComponent } from '../../component/physics/KinematicRigidBodyComponent.js'
import { DynamicRigidBodyComponent } from '../../component/physics/DynamicRigidBodyComponent.js'
import { PositionComponent } from '../../../../../shared/component/PositionComponent.js'
import { RotationComponent } from '../../../../../shared/component/RotationComponent.js'
/*
  The EventDestroyed is first inside the EventQueue Entity.
  Then it is added to the destroyed Player entity.
  The destroyed Player entity is then sent to all the other clients with its EventDestroyed component.  
  -> So front end knows which entity to remove.
  The after update is called after the network broadcast. And it removes the entity from the EntityManager.
*/

export class DestroyEventSystem {
  update(entities: Entity[]) {
    const destroyedEvents = BaseEventSystem.getEventsByType(EntityDestroyedEvent)

    for (const destroyedEvent of destroyedEvents) {
      const entity = EntityManager.getEntityById(entities, destroyedEvent.entityId)
      if (!entity) {
        console.error('Update : DestroySystem: Entity not found with id', destroyedEvent.entityId)
        return
      }

      if (entity.getComponent(PlayerComponent)) {
        BaseEventSystem.addEvent(
          new ChatMessageEvent(entity.id, '🖥️ [SERVER]', `Player ${entity.id} left the game.`)
        )
      }

      // Removing all the components
      entity.removeAllComponents()

      // The EventDestroyed component is sent to the player
      entity.addComponent(destroyedEvent)
      const networkComponent = entity.getComponent(NetworkDataComponent)
      if (networkComponent) {
        networkComponent.addComponent(destroyedEvent)
      }
    }
  }

  // Removing it after so client can receives the NetworkDataComponent
  afterUpdate(entities: Entity[]) {
    const destroyedEvents = BaseEventSystem.getEventsByType(EntityDestroyedEvent)

    for (const destroyedEvent of destroyedEvents) {
      const entity = EntityManager.getEntityById(entities, destroyedEvent.entityId)
      if (!entity) {
        console.error(
          'After Update : DestroySystem: Entity not found with id',
          destroyedEvent.entityId
        )
        return
      }

      // No need to remove all the components, the entity is removed from the EntityManager, will be garbage collected.
      EntityManager.getInstance().removeEntityById(destroyedEvent.entityId)
    }
  }
}
