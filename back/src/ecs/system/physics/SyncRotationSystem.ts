import { RotationComponent } from '../../../../../shared/component/RotationComponent.js'
import { Entity } from '../../../../../shared/entity/Entity.js'
import { DynamicPhysicsBodyComponent } from '../../component/DynamicPhysicsBodyComponent.js'
import { KinematicPhysicsBodyComponent } from '../../component/KinematicPhysicsBodyComponent.js'

export class SyncRotationSystem {
  update(entities: Entity[]) {
    for (const entity of entities) {
      const bodyComponent =
        entity.getComponent(DynamicPhysicsBodyComponent) ||
        entity.getComponent(KinematicPhysicsBodyComponent)
      const rotationComponent = entity.getComponent(RotationComponent)

      if (bodyComponent && rotationComponent) {
        const rotation = bodyComponent.body.rotation()
        rotationComponent.x = rotation.x
        rotationComponent.y = rotation.y
        rotationComponent.z = rotation.z
        rotationComponent.w = rotation.w
      }
    }
  }
}
