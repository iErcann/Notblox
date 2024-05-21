import * as THREE from 'three'
import { Component } from '@shared/component/Component'

// TODO: Make this server side too.

export class MeshComponent extends Component {
  mesh: THREE.Mesh
  constructor(entityId: number) {
    super(entityId)
    this.mesh = new THREE.Mesh()
  }
}
