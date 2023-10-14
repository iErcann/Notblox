import * as THREE from "three";
import { Vector3 } from "three";
import { Renderer } from "./renderer";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export class Camera extends THREE.PerspectiveCamera {
  public followedObject: THREE.Mesh | undefined;
  public orbitControls: OrbitControls;
  constructor(renderer: Renderer) {
    super(60, window.innerWidth / window.innerHeight);

    // this.position.applyAxisAngle(new Vector3(0, 1, 0), Math.PI / 2);
    this.orbitControls = new OrbitControls(this, renderer.domElement);
    this.orbitControls.autoRotate = false;
    this.orbitControls.maxDistance = 13;
    this.orbitControls.minDistance = 13;
    this.orbitControls.enablePan = false;
    this.orbitControls.enableDamping = false;
    this.orbitControls.minPolarAngle = -Math.PI / 2;
    this.orbitControls.maxPolarAngle = Math.PI / 2;
  }

  update() {
    this.orbitControls.update();
  }
}
