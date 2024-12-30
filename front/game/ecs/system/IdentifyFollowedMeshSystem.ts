import { Game } from '@/game/game.js'
import { Entity } from '@shared/entity/Entity.js'
import { SerializedStateType } from '@shared/network/server/serialized.js'
import { FollowComponent } from '../component/FollowComponent.js'
import { CurrentPlayerComponent } from '../component/CurrentPlayerComponent.js'
import { PlayerComponent } from '@shared/component/PlayerComponent.js'
import { VehicleComponent } from '@shared/component/VehicleComponent.js'
import { EntityManager } from '@shared/system/EntityManager.js'
import { StateComponent } from '@shared/component/StateComponent.js'

export class IdentifyFollowedMeshSystem {
  update(entities: Entity[], game: Game) {
    if (!game.currentPlayerEntityId) return

    const currentPlayerEntity = EntityManager.getEntityById(entities, game.currentPlayerEntityId)

    if (!currentPlayerEntity) return

    const playerComponent = currentPlayerEntity.getComponent(PlayerComponent)

    // Ensure the current player has the required components
    if (playerComponent && !currentPlayerEntity.getComponent(CurrentPlayerComponent)) {
      currentPlayerEntity.addComponent(new CurrentPlayerComponent(currentPlayerEntity.id))
      currentPlayerEntity.addComponent(
        new FollowComponent(currentPlayerEntity.id, game.renderer.camera)
      )
    }

    const playerStateComponent = currentPlayerEntity.getComponent(StateComponent)
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
          if (currentPlayerEntity.getComponent(FollowComponent)) {
            currentPlayerEntity.removeComponent(FollowComponent)
          }
          if (!vehicleEntity.getComponent(FollowComponent)) {
            vehicleEntity.addComponent(new FollowComponent(vehicleEntity.id, game.renderer.camera))
            console.log('AFTER', vehicleEntity)
          }
        }
        // If the current player stopped driving a vehicle
        else if (
          playerStateComponent.state !== SerializedStateType.VEHICLE_DRIVING &&
          !currentPlayerEntity.getComponent(FollowComponent)
        ) {
          // Stop following the vehicle and follow the current player instead
          if (vehicleEntity.getComponent(FollowComponent)) {
            vehicleEntity.removeComponent(FollowComponent)
          } else {
            console.log('CANT REMOVE? WTF!', vehicleEntity)
          }

          currentPlayerEntity.addComponent(
            new FollowComponent(currentPlayerEntity.id, game.renderer.camera)
          )
        }
      }
    }
  }
}
