import * as THREE from 'three'
import { Component } from '@shared/component/Component'

export class MeshComponent extends Component {
  constructor(entityId: number, public mesh = new THREE.Mesh()) {
    super(entityId)
  }
}
