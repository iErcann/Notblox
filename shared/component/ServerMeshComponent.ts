import { SerializedComponent, SerializedComponentType } from '../network/server/serialized.js'
import { NetworkComponent } from '../network/NetworkComponent.js'

// TODO: Fix the async load of the mesh in the front
// This will fix the color of the mesh not being set because we need for the mesh to be loaded before setting the color
/**
 * Holds the path to the rendered mesh file
 * Will be rendered by the client with a MeshComponent
 */
export class ServerMeshComponent extends NetworkComponent {
  constructor(entityId: number, public filePath: string) {
    super(entityId, SerializedComponentType.SERVER_MESH)
  }
  serialize(): SerializedMeshComponent {
    return {
      p: this.filePath,
    }
  }
  deserialize(data: SerializedMeshComponent): void {
    this.filePath = data.p
  }
}

export interface SerializedMeshComponent extends SerializedComponent {
  /* Path to the mesh file */
  p: string
}
