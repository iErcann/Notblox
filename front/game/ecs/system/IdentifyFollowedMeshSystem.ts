import { Game } from '@/game/game.js'
import { Entity } from '@shared/entity/Entity.js'
import { SerializedStateType } from '@shared/network/server/serialized.js'
import { FollowComponent } from '../component/FollowComponent.js'
import { CurrentPlayerComponent } from '../component/CurrentPlayerComponent.js'
import { PlayerComponent } from '@shared/component/PlayerComponent.js'
import { VehicleComponent } from '@shared/component/VehicleComponent.js'
import { EntityManager } from '@shared/system/EntityManager.js'
import { StateComponent } from '@shared/component/StateComponent.js'
import { EventSystem } from '@shared/system/EventSystem'
import { ComponentAddedEvent } from '@shared/component/events/ComponentAddedEvent'

export class IdentifyFollowedMeshSystem {
  currentPlayerEntity?: Entity
  handlePlayerCreation(entities: Entity[], game: Game) {
    const addedPlayerEvents = EventSystem.getEventsWrapped(ComponentAddedEvent, PlayerComponent)
    for (const playerEvent of addedPlayerEvents) {
      const playerComponent: PlayerComponent = playerEvent.component
      if (playerComponent.entityId === game.currentPlayerEntityId) {
        const entity = EntityManager.getEntityById(entities, playerEvent.entityId)
        if (entity) {
          entity.addComponent(new CurrentPlayerComponent(playerEvent.entityId))
          entity.addComponent(new FollowComponent(playerEvent.entityId, game.renderer.camera))
          this.currentPlayerEntity = entity
        }
      }
    }
  }
  update(entities: Entity[], game: Game) {
    if (!this.currentPlayerEntity && game.currentPlayerEntityId) {
      this.handlePlayerCreation(entities, game)
    }

    if (!this.currentPlayerEntity) {
      return
    }
    const playerStateComponent = this.currentPlayerEntity.getComponent(StateComponent)
    if (!playerStateComponent) {
      return
    }

    if (playerStateComponent.updated) {
      for (const vehicleEntity of entities) {
        const vehicleComponent = vehicleEntity.getComponent(VehicleComponent)
        if (!vehicleComponent) continue

        // If the current player started driving a vehicle.
        if (
          playerStateComponent.state === SerializedStateType.VEHICLE_DRIVING &&
          vehicleComponent.driverEntityId === game.currentPlayerEntityId
        ) {
          // Stop following the current player and follow the vehicle instead
          if (this.currentPlayerEntity.getComponent(FollowComponent)) {
            this.currentPlayerEntity.removeComponent(FollowComponent)
          }
          if (!vehicleEntity.getComponent(FollowComponent)) {
            vehicleEntity.addComponent(new FollowComponent(vehicleEntity.id, game.renderer.camera))
            console.log('AFTER', vehicleEntity)
          }
        }
        // If the current player stopped driving a vehicle
        else if (
          playerStateComponent.state !== SerializedStateType.VEHICLE_DRIVING &&
          !this.currentPlayerEntity.getComponent(FollowComponent)
        ) {
          // Stop following the vehicle and follow the current player instead
          if (vehicleEntity.getComponent(FollowComponent)) {
            vehicleEntity.removeComponent(FollowComponent)
          } else {
            console.log('CANT REMOVE? WTF!', vehicleEntity)
          }

          this.currentPlayerEntity.addComponent(
            new FollowComponent(this.currentPlayerEntity.id, game.renderer.camera)
          )
        }
      }
    }
  }
}
