import { SingleSizeComponent } from '@shared/component/SingleSizeComponent'
import { MeshComponent } from '../component/MeshComponent'
import { SizeComponent } from '@shared/component/SizeComponent'
import { Entity } from '@shared/entity/Entity'

export class SyncSizeSystem {
  update(entities: Entity[]) {
    for (const entity of entities) {
      const meshComponent = entity.getComponent(MeshComponent)
      if (!meshComponent) continue

      const sizeComponent = entity.getComponent(SizeComponent)
      if (sizeComponent && sizeComponent.updated) {
        meshComponent.mesh.scale.set(sizeComponent.width, sizeComponent.height, sizeComponent.depth)
        continue
      }

      const singleSizeComponent = entity.getComponent(SingleSizeComponent)
      if (singleSizeComponent && singleSizeComponent.updated) {
        meshComponent.mesh.scale.set(
          singleSizeComponent.size,
          singleSizeComponent.size,
          singleSizeComponent.size
        )
      }
    }
  }
}
