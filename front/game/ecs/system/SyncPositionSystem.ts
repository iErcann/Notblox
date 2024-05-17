import * as THREE from 'three'
import { Entity } from '@shared/entity/Entity'
import { MeshComponent } from '../component/MeshComponent'
import { PositionComponent } from '@shared/component/PositionComponent'

export class SyncPositionSystem {
  update(entities: Entity[], interpolationFactor: number) {
    for (const entity of entities) {
      const meshComponent = entity.getComponent(MeshComponent)
      const positionComponent = entity.getComponent(PositionComponent)

      if (meshComponent && positionComponent) {
        const targetPosition = new THREE.Vector3(
          positionComponent.x,
          positionComponent.y,
          positionComponent.z
        )
        meshComponent.mesh.position.lerp(targetPosition, interpolationFactor)
      }
    }
  }
}
