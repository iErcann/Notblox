import * as THREE from "three";
import { Vector3 } from "three";
import { Renderer } from "./renderer";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export class Camera extends THREE.PerspectiveCamera {
  public followedObject: THREE.Mesh | undefined;
  public offset = new THREE.Vector3(0, 9, 15);
  constructor() {
    super(60, window.innerWidth / window.innerHeight);
    this.position.copy(this.offset);

    // this.position.applyAxisAngle(new Vector3(0, 1, 0), Math.PI / 2);
    this.lookAt(0, 0, 0);
  }

  update(lookingDirection: number = 0) {}
}
