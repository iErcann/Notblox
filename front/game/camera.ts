import CameraControls from 'camera-controls'
import * as THREE from 'three'
import { BetterOrbitCameraFollowSystem } from './ecs/system/BetterOrbitCameraFollowSystem'
import { Entity } from '@shared/entity/Entity'
import { InputMessage } from '@shared/network/client/input'

export class Camera extends THREE.PerspectiveCamera {
  followedObject: THREE.Mesh | undefined
  offset = new THREE.Vector3(0, 5, 15)
  private controlSystem: BetterOrbitCameraFollowSystem

  constructor(renderer: THREE.WebGLRenderer) {
    super(70, window.innerWidth / window.innerHeight)
    this.position.copy(this.offset)
    this.controlSystem = new BetterOrbitCameraFollowSystem(this, renderer)
  }

  update(dt: number, entities: Entity[], inputMessage: InputMessage) {
    this.controlSystem.update(dt, entities, inputMessage)
  }
}
