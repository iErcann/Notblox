import * as THREE from 'three'
import { Entity } from '@shared/entity/Entity'
import { MeshComponent } from '../component/MeshComponent'
import { RotationComponent } from '@shared/component/RotationComponent'
import { SerializedEntityType } from '@shared/network/server/serialized'

export class SyncRotationSystem {
  update(entities: Entity[], interpolationFactor: number) {
    for (const entity of entities) {
      const meshComponent = entity.getComponent(MeshComponent)
      const rotationComponent = entity.getComponent(RotationComponent)

      if (meshComponent && rotationComponent) {
        const targetQuaternion = new THREE.Quaternion(
          rotationComponent.x,
          rotationComponent.y,
          rotationComponent.z,
          rotationComponent.w
        )

        // Interpolate rotation using slerp (spherical linear interpolation)
        if (entity.type === SerializedEntityType.VEHICLE) {
          meshComponent.mesh.quaternion.slerp(targetQuaternion, interpolationFactor / 2)
        } else {
          meshComponent.mesh.quaternion.slerp(targetQuaternion, interpolationFactor)
        }
      }
    }
  }
}
