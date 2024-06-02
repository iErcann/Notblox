import { Component } from './Component.js'

// TODO: Fix the async load of the mesh in the front
// This will fix the color of the mesh not being set because we need for the mesh to be loaded before setting the color
export class ServerMeshComponent extends Component {
  constructor(entityId: number, public filePath: string) {
    super(entityId)
  }
}
