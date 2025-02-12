import * as THREE from 'three'
import { Entity } from '@shared/entity/Entity'
import { MeshComponent } from '../component/MeshComponent'
import { RotationComponent } from '@shared/component/RotationComponent'
import { VehicleComponent } from '@shared/component/VehicleComponent'
export class SyncRotationSystem {
  update(entities: Entity[], interpolationFactor: number) {
    for (const entity of entities) {
      const meshComponent = entity.getComponent(MeshComponent)
      const rotationComponent = entity.getComponent(RotationComponent)
      const vehicleComponent = entity.getComponent(VehicleComponent)

      if (meshComponent && rotationComponent) {
        const targetQuaternion = new THREE.Quaternion(
          rotationComponent.x,
          rotationComponent.y,
          rotationComponent.z,
          rotationComponent.w
        )

        // Interpolate rotation using slerp (spherical linear interpolation)
        meshComponent.mesh.quaternion.slerp(
          targetQuaternion,
          vehicleComponent ? 0.5 : interpolationFactor
        )
      }
    }
  }
}
