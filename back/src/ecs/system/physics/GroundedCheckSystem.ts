import { PositionComponent } from '../../../../../shared/component/PositionComponent.js'
import { SingleSizeComponent } from '../../../../../shared/component/SingleSizeComponent.js'
import { Entity } from '../../../../../shared/entity/Entity.js'
import Rapier from '../../../physics/rapier.js'
import { GroundCheckComponent } from '../../component/GroundedComponent.js'
import { BoxColliderComponent } from '../../component/physics/BoxColliderComponent.js'
import { CapsuleColliderComponent } from '../../component/physics/CapsuleColliderComponent.js'
import { DynamicRigidBodyComponent } from '../../component/physics/DynamicRigidBodyComponent.js'

export class GroundedCheckSystem {
  update(entities: Entity[], world: Rapier.World) {
    for (const entity of entities) {
      const groundedComponent = entity.getComponent(GroundCheckComponent)
      const bodyComponent = entity.getComponent(DynamicRigidBodyComponent)
      const positionComponent = entity.getComponent(PositionComponent)
      const colliderComponent =
        entity.getComponent(CapsuleColliderComponent) || entity.getComponent(BoxColliderComponent)

      if (groundedComponent && bodyComponent && positionComponent && colliderComponent) {
        const sizeComponent = entity.getComponent(SingleSizeComponent)
        const size = sizeComponent?.size || 1.0

        const ray = new Rapier.Ray(
          {
            x: positionComponent.x,
            y: positionComponent.y - 1,
            z: positionComponent.z,
          },
          {
            x: 0,
            y: -1,
            z: 0,
          }
        )
        const hit = world.castRay(
          ray,
          size * 2,
          false,
          undefined,
          undefined,
          colliderComponent.collider
        )
        groundedComponent.grounded = hit ? true : false
      }
    }
  }
}
