import { PositionComponent } from '@shared/component/PositionComponent'
import { ProximityPromptComponent } from '@shared/component/ProximityPromptComponent.js'
import { Entity } from '@shared/entity/Entity.js'
import { ClientMessageType } from '@shared/network/client/base.js'
import { ProximityPromptInteractMessage } from '@shared/network/client/proximityPromptMessage.js'
import { EntityManager } from '@shared/system/EntityManager'
import * as THREE from 'three'
import { CurrentPlayerComponent } from '../component/CurrentPlayerComponent'

export class ProximityPromptSystem {
  // Update the interaction accumulator for the current player
  update(entities: Entity[], dt: number) {
    for (const entity of entities) {
      const proximityPromptComponent = entity.getComponent(ProximityPromptComponent)
      // Update the interaction accumulator for each entity
      if (proximityPromptComponent) {
        proximityPromptComponent.accumulatorPerEntity.forEach((accumulator, playerEntity) => {
          const cappedAccumulator = Math.min(
            accumulator + dt,
            proximityPromptComponent.interactionCooldown * 2
          )
          proximityPromptComponent.accumulatorPerEntity.set(playerEntity, cappedAccumulator)
        })
      }
    }
  }
  getCurrentPlayer(entities: Entity[]): Entity | null {
    const player = EntityManager.getFirstEntityWithComponent(entities, CurrentPlayerComponent)
    if (!player) return null
    return player
  }

  findNearestProximityPromptEntity(currentPlayer: Entity, entities: Entity[]): Entity | null {
    const playerPosition = currentPlayer.getComponent(PositionComponent)
    if (!playerPosition) return null

    const playerPositionVector = new THREE.Vector3(
      playerPosition.x,
      playerPosition.y,
      playerPosition.z
    )

    let nearestEntity: Entity | null = null
    let nearestProximityPromptComponent: ProximityPromptComponent | null = null
    let nearestDistance = Infinity
    for (const entity of entities) {
      const proximityPromptComponent = entity.getComponent(ProximityPromptComponent)
      if (proximityPromptComponent) {
        const positionComponent = entity.getComponent(PositionComponent)
        if (positionComponent) {
          const posVector = new THREE.Vector3(
            positionComponent.x,
            positionComponent.y,
            positionComponent.z
          )
          const distance = playerPositionVector.distanceTo(posVector)
          // Will be also validated by the server.
          if (
            distance <= proximityPromptComponent.textComponent.displayDistance &&
            distance < nearestDistance
          ) {
            nearestEntity = entity
            nearestProximityPromptComponent = proximityPromptComponent
            nearestDistance = distance
          }
        }
      }
    }
    if (
      nearestProximityPromptComponent &&
      this.isOnCooldown(currentPlayer, nearestProximityPromptComponent)
    ) {
      return null
    }

    return nearestEntity
  }

  isOnCooldown(playerEntity: Entity, proximityPromptComponent: ProximityPromptComponent): boolean {
    const interactionAccumulator = proximityPromptComponent.accumulatorPerEntity.get(playerEntity)
    if (interactionAccumulator === undefined) {
      proximityPromptComponent.accumulatorPerEntity.set(playerEntity, 0)
      return false
    }

    // Add a small buffer to the cooldown to avoid flickering
    return interactionAccumulator < proximityPromptComponent.interactionCooldown + 100
  }

  getMessage(entities: Entity[]): ProximityPromptInteractMessage | null {
    const currentPlayer = this.getCurrentPlayer(entities)
    if (!currentPlayer) return null

    const entity = this.findNearestProximityPromptEntity(currentPlayer, entities)
    if (entity) {
      // Construct the message for the server
      const message: ProximityPromptInteractMessage = {
        t: ClientMessageType.PROXIMITY_PROMPT_INTERACT,
        eId: entity.id,
      }
      // Reset accumulator without waiting for the server response
      const proximityPromptComponent = entity.getComponent(ProximityPromptComponent)
      if (proximityPromptComponent) {
        proximityPromptComponent.accumulatorPerEntity.set(currentPlayer, 0)
      }
      return message
    }
    return null
  }
}
