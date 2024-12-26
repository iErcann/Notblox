import { PositionComponent } from '../../../../shared/component/PositionComponent.js'
import { ProximityPromptComponent } from '../../../../shared/component/ProximityPromptComponent.js'
import { Entity } from '../../../../shared/entity/Entity.js'
import { InputComponent } from '../component/InputComponent.js'
import * as THREE from 'three'

export class ProximityPromptSystem {
  // Player Entity Id -> Interaction Accumulator
  private interactionAccumulatorPerPlayer: Map<Entity, number> = new Map()

  update(entities: Entity[], dt: number) {
    for (const entity of entities) {
      const inputComponent = entity.getComponent(InputComponent)
      const positionComponent = entity.getComponent(PositionComponent)
      if (!positionComponent || !inputComponent || !inputComponent.interact) continue
      const posVector = new THREE.Vector3(
        positionComponent.x,
        positionComponent.y,
        positionComponent.z
      )

      for (const otherEntity of entities) {
        const proximityPromptComponent = otherEntity.getComponent(ProximityPromptComponent)
        if (!proximityPromptComponent) continue

        if (
          Date.now() - proximityPromptComponent.lastInteractionTime <
          proximityPromptComponent.interactionCooldown
        )
          continue

        const otherPositionComponent = otherEntity.getComponent(PositionComponent)
        if (!otherPositionComponent) continue

        const otherPosVector = new THREE.Vector3(
          otherPositionComponent.x,
          otherPositionComponent.y,
          otherPositionComponent.z
        )

        if (
          posVector.distanceTo(otherPosVector) <=
          proximityPromptComponent.textComponent.displayDistance
        ) {
          proximityPromptComponent.interact(entity)
          proximityPromptComponent.lastInteractionTime = Date.now()
        }
      }
    }
  }
}
