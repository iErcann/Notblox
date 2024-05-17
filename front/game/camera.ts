import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export class Camera extends THREE.PerspectiveCamera {
  public followedObject: THREE.Mesh | undefined
  public offset = new THREE.Vector3(0, 5, 15)
  // public controls: OrbitControls;

  constructor(renderer: THREE.WebGLRenderer) {
    super(70, window.innerWidth / window.innerHeight)
    this.position.copy(this.offset)

    // this.controls = new OrbitControls(this, renderer.domElement);
  }

  update(lookingDirection: number = 0) {
    // this.controls.update();
  }
}
