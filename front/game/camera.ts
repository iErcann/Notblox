import * as THREE from 'three'
import { OrbitCameraFollowSystem } from './ecs/system/OrbitCameraFollowSystem'
import { Entity } from '@shared/entity/Entity'
import { InputMessage } from '@shared/network/client/input'

export class Camera extends THREE.PerspectiveCamera {
  offset = new THREE.Vector3(0, 5, 15)
  private controlSystem: OrbitCameraFollowSystem

  constructor(renderer: THREE.WebGLRenderer) {
    super(70, window.innerWidth / window.innerHeight)
    this.position.copy(this.offset)
    this.controlSystem = new OrbitCameraFollowSystem(this, renderer)
  }

  update(dt: number, entities: Entity[], inputMessage: InputMessage) {
    this.controlSystem.update(dt, entities, inputMessage)
  }
}
