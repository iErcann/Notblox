import * as THREE from "three";
import { Vector3 } from "three";
import { Renderer } from "./renderer";

export class Camera extends THREE.PerspectiveCamera {
  followedObject: THREE.Mesh | undefined;

  constructor() {
    super(66, window.innerWidth / window.innerHeight, 0.01, 1000);
    this.position.set(0, 15, 12);

    this.lookAt(0, 0, 0);
  }

  update(lookingDirection: number = 0) {
    if (this.followedObject) {
      // Smoothly follow the object's position
      this.position.lerp(
        this.followedObject.position.clone().add(new Vector3(0, 2, 0)),
        0.4
      );
    }
    // Optionally set a fixed looking direction
    // this.rotation.setFromVector3(new THREE.Vector3(0, THREE.MathUtils.degToRad(lookingDirection), 0));
  }

  setFollowedObject(object: THREE.Mesh) {
    this.followedObject = object;
    // Optionally, you can attach the camera to the followed object
    // this.followedObject.add(this);
  }
}
