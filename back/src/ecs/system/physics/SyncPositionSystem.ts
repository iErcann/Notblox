import { PhysicsBodyComponent } from '../../component/PhysicsBodyComponent.js'
import { PositionComponent } from '../../../../../shared/component/PositionComponent.js'
import { Entity } from '../../../../../shared/entity/Entity.js'

export class SyncPositionSystem {
  moveThreshold = 0.01

  update(entities: Entity[]) {
    for (const entity of entities) {
      const bodyComponent = entity.getComponent(PhysicsBodyComponent)
      const positionComponent = entity.getComponent(PositionComponent)

      if (bodyComponent && positionComponent) {
        const newPosition = bodyComponent.body.translation()
        if (this.hasPositionChanged(newPosition, positionComponent)) {
          positionComponent.updated = true
        }
        positionComponent.x = newPosition.x
        positionComponent.y = newPosition.y
        positionComponent.z = newPosition.z
      }
    }
  }

  hasPositionChanged(
    position: { x: number; y: number; z: number },
    positionComponent: PositionComponent
  ) {
    const dx = Math.abs(position.x - positionComponent.x)
    const dy = Math.abs(position.y - positionComponent.y)
    const dz = Math.abs(position.z - positionComponent.z)

    return dx >= this.moveThreshold || dy >= this.moveThreshold || dz >= this.moveThreshold
  }
}
