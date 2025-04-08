import { Game } from '@/game/Game.js'
import { Entity } from '@shared/entity/Entity.js'
import { SerializedStateType } from '@shared/network/server/serialized.js'
import { CameraFollowComponent } from '../component/CameraFollowComponent.js'
import { CurrentPlayerComponent } from '../component/CurrentPlayerComponent.js'
import { PlayerComponent } from '@shared/component/PlayerComponent.js'
import { VehicleComponent } from '@shared/component/VehicleComponent.js'
import { EntityManager } from '@shared/system/EntityManager.js'
import { StateComponent } from '@shared/component/StateComponent.js'
import { EventSystem } from '@shared/system/EventSystem'
import { ComponentAddedEvent } from '@shared/component/events/ComponentAddedEvent'
import { VehicleOccupancyComponent } from '@shared/component/VehicleOccupancyComponent.js'
import { ComponentRemovedEvent } from '@shared/component/events/ComponentRemovedEvent.js'

export class IdentifyFollowedMeshSystem {
  currentPlayerEntity?: Entity
  followedEntity?: Entity
  handlePlayerCreation(entities: Entity[], game: Game) {
    const addedPlayerEvents = EventSystem.getEventsWrapped(ComponentAddedEvent, PlayerComponent)
    for (const playerEvent of addedPlayerEvents) {
      const playerComponent: PlayerComponent = playerEvent.component
      if (playerComponent.entityId === game.currentPlayerEntityId) {
        const entity = EntityManager.getEntityById(entities, playerEvent.entityId)
        if (entity) {
          entity.addComponent(new CurrentPlayerComponent(playerEvent.entityId))
          entity.addComponent(new CameraFollowComponent(playerEvent.entityId, game.renderer.camera))
          this.currentPlayerEntity = entity
          this.followedEntity = entity
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

    // Get all events about a player starting to occupy a vehicle
    const addedVehicleOccupancyEvents = EventSystem.getEventsWrapped(
      ComponentAddedEvent,
      VehicleOccupancyComponent
    )

    for (const vehicleOccupancyEvent of addedVehicleOccupancyEvents) {
      console.log('vehicleOccupancyEvent', vehicleOccupancyEvent)
      const vehicleOccupancyComponent: VehicleOccupancyComponent = vehicleOccupancyEvent.component
      if (vehicleOccupancyComponent.entityId === this.currentPlayerEntity.id) {
        const vehicle = EntityManager.getEntityById(
          entities,
          vehicleOccupancyComponent.vehicleEntityId
        )

        if (!vehicle) {
          console.error('IdentifyFollowedMeshSystem: Vehicle not found')
          continue
        }
        // Stop following previous entity
        this.followedEntity?.removeComponent(CameraFollowComponent)
        // Follow the vehicle
        vehicle.addComponent(new CameraFollowComponent(vehicle.id, game.renderer.camera))
        this.followedEntity = vehicle
      }
    }

    // Get all events about a player stopping to occupy a vehicle
    const removedVehicleOccupancyEvents = EventSystem.getEventsWrapped(
      ComponentRemovedEvent,
      VehicleOccupancyComponent
    )

    for (const vehicleOccupancyEvent of removedVehicleOccupancyEvents) {
      const vehicleOccupancyComponent: VehicleOccupancyComponent = vehicleOccupancyEvent.component
      if (vehicleOccupancyComponent.entityId === this.currentPlayerEntity.id) {
        // Stop following the vehicle
        this.followedEntity?.removeComponent(CameraFollowComponent)
        // Follow the current player entity
        this.currentPlayerEntity.addComponent(
          new CameraFollowComponent(this.currentPlayerEntity.id, game.renderer.camera)
        )
        this.followedEntity = this.currentPlayerEntity
      }
    }
  }
}
