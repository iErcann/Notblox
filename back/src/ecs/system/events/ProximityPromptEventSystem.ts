import { EventSystem } from '../../../../../shared/system/EventSystem.js'
import { PositionComponent } from '../../../../../shared/component/PositionComponent.js'
import { ProximityPromptComponent } from '../../../../../shared/component/ProximityPromptComponent.js'
import { Entity } from '../../../../../shared/entity/Entity.js'
import * as THREE from 'three'
import { EntityManager } from '../../../../../shared/system/EntityManager.js'
import { ProximityPromptInteractEvent } from '../../component/events/ProximityPromptInteractEvent.js'

export class ProximityPromptSystem {
  update(entities: Entity[], dt: number) {
    // Update the interaction accumulator for each entity
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

    // Get all the proximity prompt interact events
    const proximityEvents = EventSystem.getEvents(ProximityPromptInteractEvent)

    for (const event of proximityEvents) {
      // Find the entity that triggered the event
      const playerEntity = EntityManager.getEntityById(entities, event.entityId)
      // Find the entity that the player interacted with
      const targetEntity = EntityManager.getEntityById(entities, event.otherEntity)
      // Get the proximity prompt component of the target entity
      const proximityPromptComponent = targetEntity?.getComponent(ProximityPromptComponent)
      // Get the position component of the player entity
      const playerPos = playerEntity?.getComponent(PositionComponent)
      // Get the position component of the target entity
      const targetPos = targetEntity?.getComponent(PositionComponent)

      if (!playerEntity || !targetEntity || !proximityPromptComponent || !playerPos || !targetPos) {
        continue
      }

      if (this.isOnCooldown(playerEntity, proximityPromptComponent)) {
        continue
      }

      // Check if the player is in range of the target entity
      if (this.isInRange(playerPos, targetPos, proximityPromptComponent.maxInteractDistance)) {
        // Interact with the target entity
        proximityPromptComponent.interact(playerEntity)
        // Reset the interaction accumulator
        proximityPromptComponent.accumulatorPerEntity.set(playerEntity, 0)
      }
    }
  }
  private isOnCooldown(
    playerEntity: Entity,
    proximityPromptComponent: ProximityPromptComponent
  ): boolean {
    const interactionAccumulator = proximityPromptComponent.accumulatorPerEntity.get(playerEntity)
    if (interactionAccumulator === undefined) {
      proximityPromptComponent.accumulatorPerEntity.set(playerEntity, 0)
      return false
    }

    return interactionAccumulator < proximityPromptComponent.interactionCooldown
  }

  private isInRange(
    pos1: PositionComponent,
    pos2: PositionComponent,
    maxDistance: number
  ): boolean {
    const posVec1 = new THREE.Vector3(pos1.x, pos1.y, pos1.z)
    const posVec2 = new THREE.Vector3(pos2.x, pos2.y, pos2.z)
    return posVec1.distanceTo(posVec2) <= maxDistance
  }
}
