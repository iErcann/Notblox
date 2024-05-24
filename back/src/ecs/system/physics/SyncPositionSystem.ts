import { DynamicPhysicsBodyComponent } from '../../component/DynamicPhysicsBodyComponent.js'
import { KinematicPhysicsBodyComponent } from '../../component/KinematicPhysicsBodyComponent.js'
import { PositionComponent } from '../../../../../shared/component/PositionComponent.js'
import { Entity } from '../../../../../shared/entity/Entity.js'

export class SyncPositionSystem {
  update(entities: Entity[]) {
    for (const entity of entities) {
      const bodyComponent =
        entity.getComponent(DynamicPhysicsBodyComponent) ||
        entity.getComponent(KinematicPhysicsBodyComponent)
      const positionComponent = entity.getComponent(PositionComponent)

      if (bodyComponent && positionComponent) {
        const position = bodyComponent.body.translation()
        positionComponent.x = position.x
        positionComponent.y = position.y
        positionComponent.z = position.z
      }
    }
  }
}
