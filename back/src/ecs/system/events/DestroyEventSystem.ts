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
import { DynamicPhysicsBodyComponent } from '../../component/DynamicPhysicsBodyComponent.js'
import { KinematicPhysicsBodyComponent } from '../../component/KinematicPhysicsBodyComponent.js'

/*
  The EventDestroyed is first inside the EventQueue Entity.
  Then it is added to the destroyed Player entity.
  The destroyed Player entity is then sent to all the other clients with its EventDestroyed component.  
  -> So front end knows which entity to remove.
  The after update is called after the network broadcast. And it removes the entity from the EntityManager.
*/

export class EventDestroySystem {
  update(entities: Entity[], eventDestroyed: EntityDestroyedEvent) {
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
      BaseEventSystem.addEvent(
        new ChatMessageEvent(entity.id, '🖥️ [SERVER]', `Player ${entity.id} left the game.`)
      )
    }
  }

  // Removing it after so client can receives the NetworkDataComponent
  afterUpdate(entities: Entity[], eventDestroyed: EntityDestroyedEvent) {
    const entity = EntityManager.getEntityById(entities, eventDestroyed.entityId)
    if (!entity) {
      console.error(
        'After Update : DestroySystem: Entity not found with id',
        eventDestroyed.entityId
      )
      return
    }

    const world = PhysicsSystem.getInstance().world

    const rigidbodyComponent =
      entity.getComponent(DynamicPhysicsBodyComponent) ||
      entity.getComponent(KinematicPhysicsBodyComponent)

    if (rigidbodyComponent) world.removeRigidBody(rigidbodyComponent.body)

    // No need to remove all the components, the entity is removed from the EntityManager, will be garbage collected.
    EntityManager.getInstance().removeEntityById(eventDestroyed.entityId)
  }
}
