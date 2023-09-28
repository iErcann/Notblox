import * as THREE from "three";
import { Renderer } from "./renderer";
import { NetworkEntity } from "./networkEntity";
import { Renderable } from "./renderer";

export class Cube implements Renderable {
  mesh: THREE.Mesh;
  material: THREE.MeshPhongMaterial;
  constructor(size: number = 1, color: number) {
    //  Rendered size = Network Size * 2
    const geometry = new THREE.BoxGeometry(size * 2, size * 2, size * 2);
    this.material = new THREE.MeshPhongMaterial();
    this.material.color = new THREE.Color(color);
    this.mesh = new THREE.Mesh(geometry, this.material);
    this.mesh.receiveShadow = true;
    this.mesh.castShadow = true;
  }
  addToScene() {
    // Renderer.instance.scene.add(this.mesh);
  }
}

export interface SerializedCube {
  position: {
    x: number;
    y: number;
    z: number;
  };
  rotation: {
    x: number;
    y: number;
    z: number;
    w: number;
  };
  size: number;
}

export class NetworkCube extends Cube implements NetworkEntity {
  public nextPosition = new THREE.Vector3();
  public nextRotation = new THREE.Quaternion();

  constructor(public entityId: number, size: number, color: number) {
    super(size, color);
  }

  sync(data: SerializedCube) {
    this.nextPosition = new THREE.Vector3(
      data.position.x,
      data.position.y,
      data.position.z
    );
    this.nextRotation = new THREE.Quaternion(
      data.rotation.x,
      data.rotation.y,
      data.rotation.z,
      data.rotation.w
    );
  }
  update(lerpValue: number) {
    //  this.mesh.position.copy(this.nextPosition)
    //  this.mesh.rotation.setFromQuaternion(this.nextRotation)
    this.mesh.position.lerp(this.nextPosition, lerpValue);
    this.mesh.quaternion.slerp(this.nextRotation, lerpValue);
  }
}
