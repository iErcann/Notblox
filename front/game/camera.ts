import * as THREE from 'three'
import { OrbitCameraFollowSystem } from './ecs/system/OrbitCameraFollowSystem'
import { Entity } from '@shared/entity/Entity'
import { InputMessage } from '@shared/network/client/inputMessage'

export class Camera extends THREE.PerspectiveCamera {
  defaultOffset = new THREE.Vector3(0, 5, 15)
  controlSystem: OrbitCameraFollowSystem

  constructor(renderer: THREE.WebGLRenderer) {
    super(70, window.innerWidth / window.innerHeight)
    this.position.copy(this.defaultOffset)
    this.controlSystem = new OrbitCameraFollowSystem(this, renderer)
  }

  update(dt: number, entities: Entity[], inputMessage: InputMessage) {
    this.controlSystem.update(dt, entities, inputMessage)
  }
}
