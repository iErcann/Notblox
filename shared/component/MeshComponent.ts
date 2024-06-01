import { SerializedComponent, SerializedComponentType } from '../network/server/serialized.js'
import { NetworkComponent } from '../network/NetworkComponent.js'

export class MeshComponent extends NetworkComponent {
  mesh: THREE.Mesh
  constructor(entityId: number) {
    super(entityId)
    this.mesh = new THREE.Mesh()
  }
}
