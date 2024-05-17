import { Entity } from '../../../../../shared/entity/Entity.js'
import { EventDestroyed } from '../../../../../shared/component/events/EventDestroyed.js'
import { EntityManager } from '../../../../../shared/entity/EntityManager.js'
import { PhysicsBodyComponent } from '../../component/PhysicsBodyComponent.js'
import { NetworkDataComponent } from '../../component/NetworkDataComponent.js'
import { WebSocketComponent } from '../../component/WebsocketComponent.js'
import { PhysicsSystem } from '../physics/PhysicsSystem.js'
import { SerializedEntityType } from '../../../../../shared/network/server/serialized.js'
import { EventSystem } from './EventSystem.js'
import { EventChatMessage } from '../../component/events/EventChatMessage.js'
import { PlayerComponent } from '../../component/tag/PlayerComponent.js'

/*
  The EventDestroyed is first inside the EventQueue Entity.
  Then it is added to the destroyed Player entity.
  The destroyed Player entity is then sent to all the other clients with its EventDestroyed component.  
  -> So front end knows which entity to remove.
  The after update is called after the network broadcast. And it removes the entity from the EntityManager.
*/

export class DestroySystem {
  update(entities: Entity[], eventDestroyed: EventDestroyed) {
    const entity = EntityManager.getEntityById(entities, eventDestroyed.entityId)
    if (!entity) {
      console.error('Update : DestroySystem: Entity not found with id', eventDestroyed.entityId)
      return
    }

    if (entity.getComponent(WebSocketComponent)) {
      // Entity is a player
      // Removing WebSocketComponent to not retrigger a broadcast on this entity if its destroyed.
      // Otherwise it throws an error.
      entity.removeComponent(WebSocketComponent)
    }

    // The EventDestroyed component is sent to the player
    entity.addComponent(eventDestroyed)
    const networkComponent = entity.getComponent(NetworkDataComponent)
    if (networkComponent) {
      networkComponent.addComponent(eventDestroyed)
    }
    console.log('DestroySystem: update: entity', entity.type, SerializedEntityType.PLAYER)

    if (entity.getComponent(PlayerComponent)) {
      EventSystem.getInstance().addEvent(
        new EventChatMessage(
          EventSystem.getInstance().eventQueue.entity.id,
          '🖥️ [SERVER]',
          `Player ${entity.id} left the game.`
        )
      )
    }
  }

  // Removing it after so client can receives the NetworkDataComponent
  afterUpdate(entities: Entity[], eventDestroyed: EventDestroyed) {
    const entity = EntityManager.getEntityById(entities, eventDestroyed.entityId)
    if (!entity) {
      console.error(
        'After Update : DestroySystem: Entity not found with id',
        eventDestroyed.entityId
      )
      return
    }

    const world = PhysicsSystem.getInstance().world

    const rigidbodyComponent = entity.getComponent(PhysicsBodyComponent)

    if (rigidbodyComponent) world.removeRigidBody(rigidbodyComponent.body)

    // No need to remove all the components, the entity is removed from the EntityManager, will be garbage collected.
    EntityManager.getInstance().removeEntityById(eventDestroyed.entityId)
  }
}
