import { PositionComponent } from '@shared/component/PositionComponent'
import { ProximityPromptComponent } from '@shared/component/ProximityPromptComponent.js'
import { Entity } from '@shared/entity/Entity.js'
import { ClientMessageType } from '@shared/network/client/base.js'
import { ProximityPromptInteractMessage } from '@shared/network/client/proximityPromptMessage.js'
import { EntityManager } from '@shared/system/EntityManager'
import * as THREE from 'three'
import { CurrentPlayerComponent } from '../component/CurrentPlayerComponent'

export class ProximityPromptSystem {
  findNearestProximityPromptEntity(entities: Entity[]) {
    const player = EntityManager.getFirstEntityWithComponent(entities, CurrentPlayerComponent)
    if (!player) return null

    const playerPosition = player.getComponent(PositionComponent)
    if (!playerPosition) return null

    const playerPositionVector = new THREE.Vector3(
      playerPosition.x,
      playerPosition.y,
      playerPosition.z
    )

    let nearestEntity: Entity | null = null
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
            nearestDistance = distance
          }
        }
      }
    }
    return nearestEntity
  }

  getMessage(entities: Entity[]): ProximityPromptInteractMessage | null {
    const entity = this.findNearestProximityPromptEntity(entities)
    if (entity) {
      const message: ProximityPromptInteractMessage = {
        t: ClientMessageType.PROXIMITY_PROMPT_INTERACT,
        eId: entity.id,
      }
      return message
    }
    return null
  }
}
