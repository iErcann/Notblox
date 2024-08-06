import { RotationComponent } from '../../../../../shared/component/RotationComponent.js'
import { Entity } from '../../../../../shared/entity/Entity.js'
import { DynamicRigidBodyComponent } from '../../component/physics/DynamicRigidBodyComponent.js'
import { KinematicRigidBodyComponent } from '../../component/physics/KinematicRigidBodyComponent.js'

export class SyncRotationSystem {
  update(entities: Entity[]) {
    for (const entity of entities) {
      const bodyComponent =
        entity.getComponent(DynamicRigidBodyComponent) ||
        entity.getComponent(KinematicRigidBodyComponent)
      const rotationComponent = entity.getComponent(RotationComponent)

      if (bodyComponent && rotationComponent && bodyComponent.body) {
        const rotation = bodyComponent.body.rotation()
        rotationComponent.x = rotation.x
        rotationComponent.y = rotation.y
        rotationComponent.z = rotation.z
        rotationComponent.w = rotation.w
      }
    }
  }
}
