import { ColorComponent } from '../../../../../shared/component/ColorComponent.js'
import { PositionComponent } from '../../../../../shared/component/PositionComponent.js'
import { Entity } from '../../../../../shared/entity/Entity.js'
import { EventSystem } from '../../../../../shared/system/EventSystem.js'
import Rapier from '../../../physics/rapier.js'
import { LockedRotationComponent } from '../../component/LockedRotationComponent.js'
import { ColorEvent } from '../../component/events/ColorEvent.js'
import { DynamicRigidBodyComponent } from '../../component/physics/DynamicRigidBodyComponent.js'
import { PlayerComponent } from '../../component/tag/TagPlayerComponent.js'

export class BoundaryCheckSystem {
  lowerBound = -40
  update(entities: Entity[]) {
    for (const entity of entities) {
      const bodyComponent = entity.getComponent(DynamicRigidBodyComponent)
      const positionComponent = entity.getComponent(PositionComponent)

      if (bodyComponent && positionComponent && positionComponent.y < this.lowerBound) {
        if (!bodyComponent.body) {
          continue
        }
        bodyComponent.body.setTranslation(
          {
            x: 0,
            y: 4,
            z: 0,
          },
          true
        )
        const colorComponent = entity.getComponent(ColorComponent)
        if (colorComponent) {
          const randomHex = Math.floor(Math.random() * 16777215).toString(16)
          EventSystem.addEvent(new ColorEvent(entity.id, '#' + randomHex))
        }
        bodyComponent.body.setLinvel(new Rapier.Vector3(0, 0, 0), true)

        if (entity.getComponent(PlayerComponent)) {
          if (entity.getComponent(LockedRotationComponent)) {
            entity.removeComponent(LockedRotationComponent)
          } else {
            entity.addComponent(new LockedRotationComponent(entity.id))
          }
        }
      }
    }
  }
}
