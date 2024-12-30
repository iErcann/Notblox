import { PositionComponent } from '../../../../../shared/component/PositionComponent.js'
import { Entity } from '../../../../../shared/entity/Entity.js'
import Rapier from '../../../physics/rapier.js'
import { LockedRotationComponent } from '../../component/LockedRotationComponent.js'
import { SpawnPositionComponent } from '../../component/SpawnPositionComponent.js'
import { DynamicRigidBodyComponent } from '../../component/physics/DynamicRigidBodyComponent.js'
import { PlayerComponent } from '../../../../../shared/component/PlayerComponent.js'

export class BoundaryCheckSystem {
  lowerBound = -100
  update(entities: Entity[]) {
    for (const entity of entities) {
      const bodyComponent = entity.getComponent(DynamicRigidBodyComponent)
      const positionComponent = entity.getComponent(PositionComponent)

      if (bodyComponent && positionComponent && positionComponent.y < this.lowerBound) {
        if (!bodyComponent.body) {
          continue
        }
        const spawnPositionComponent = entity.getComponent(SpawnPositionComponent)
        if (spawnPositionComponent) {
          bodyComponent.body.setTranslation(
            {
              x: spawnPositionComponent.x,
              y: spawnPositionComponent.y,
              z: spawnPositionComponent.z,
            },
            true
          )
        } else {
          bodyComponent.body.setTranslation(
            {
              x: 0,
              y: 10,
              z: 0,
            },
            true
          )
        }
        bodyComponent.body.setLinvel(new Rapier.Vector3(0, 0, 0), true)
        bodyComponent.body.setAngvel(new Rapier.Vector3(0, 0, 0), true)

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
