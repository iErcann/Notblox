import { SingleSizeComponent } from '@shared/component/SingleSizeComponent'
import { MeshComponent } from '../component/MeshComponent'
import { SizeComponent } from '@shared/component/SizeComponent'
import { Entity } from '@shared/entity/Entity'
import { SerializedEntityType } from '@shared/network/server/serialized'
import { BoxGeometry, SphereGeometry } from 'three'

export class SyncSizeSystem {
  update(entities: Entity[]) {
    for (const entity of entities) {
      const meshComponent = entity.getComponent(MeshComponent)
      const sizeComponent = entity.getComponent(SizeComponent)
      if (!meshComponent) continue
      if (sizeComponent && sizeComponent.updated) {
        // Scale the mesh to the new size.
        meshComponent.mesh.scale.set(sizeComponent.width, sizeComponent.height, sizeComponent.depth)
      }
      const singleSizeComponent = entity.getComponent(SingleSizeComponent)
      if (singleSizeComponent && singleSizeComponent.updated) {
        if (entity.type === SerializedEntityType.SPHERE) {
          meshComponent.mesh.geometry.dispose() // Avoids memory leak.
          meshComponent.mesh.geometry = new SphereGeometry(singleSizeComponent.size, 32, 16)
        } else {
          meshComponent.mesh.scale.set(
            singleSizeComponent.size,
            singleSizeComponent.size,
            singleSizeComponent.size
          )
        }
      }
    }
  }
}
