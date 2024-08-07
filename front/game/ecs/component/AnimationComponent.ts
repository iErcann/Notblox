import { Component } from '@shared/component/Component'
import * as THREE from 'three'

export class AnimationComponent extends Component {
  mixer: THREE.AnimationMixer | null = null
  animationState: number = 0
  animations: THREE.AnimationClip[] = []

  constructor(
    public entityId: number,
    public mesh?: THREE.Mesh,
    animations?: THREE.AnimationClip[]
  ) {
    super(entityId)
    if (mesh) {
      this.mixer = new THREE.AnimationMixer(mesh)
    }
    if (animations) {
      this.animations = animations
    }
  }

  setMesh(mesh: THREE.Mesh) {
    this.mesh = mesh
    this.mixer = new THREE.AnimationMixer(mesh)
  }

  setAnimations(animations: THREE.AnimationClip[]) {
    this.animations = animations
  }
}