import { Component } from './Component.js'

export class ServerMeshComponent extends Component {
  constructor(entityId: number, public filePath: string) {
    super(entityId)
  }
}
