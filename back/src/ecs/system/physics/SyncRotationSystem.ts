import { PhysicsBodyComponent } from '../../component/PhysicsBodyComponent.js'
import { RotationComponent } from '../../../../../shared/component/RotationComponent.js'
import { Entity } from '../../../../../shared/entity/Entity.js'

export class SyncRotationSystem {
  moveTreshold = 0.01
  update(entities: Entity[]) {
    for (const entity of entities) {
      const bodyComponent = entity.getComponent(PhysicsBodyComponent)
      const rotationComponent = entity.getComponent(RotationComponent)

      if (bodyComponent && rotationComponent) {
        const rotation = bodyComponent.body.rotation()
        if (this.hasRotationChanged(rotation, rotationComponent)) {
          rotationComponent.updated = true
        }
        rotationComponent.x = rotation.x
        rotationComponent.y = rotation.y
        rotationComponent.z = rotation.z
        rotationComponent.w = rotation.w
      }
    }
  }

  hasRotationChanged(
    rotation: { x: number; y: number; z: number; w: number },
    rotationComponent: RotationComponent
  ) {
    const dx = Math.abs(rotation.x - rotationComponent.x)
    const dy = Math.abs(rotation.y - rotationComponent.y)
    const dz = Math.abs(rotation.z - rotationComponent.z)
    const dw = Math.abs(rotation.w - rotationComponent.w)

    console.log('dx', dx)
    console.log('dy', dy)
    console.log('dz', dz)

    return (
      dx > this.moveTreshold ||
      dy > this.moveTreshold ||
      dz > this.moveTreshold ||
      dw > this.moveTreshold
    )
  }
}
