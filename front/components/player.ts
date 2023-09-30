import * as THREE from "three";
import { Renderable } from "./renderer";
import { NetworkEntity } from "./networkEntity";
import { SerializedPositionComponent } from "@shared/serialized";

export class Player implements Renderable {
  mesh: THREE.Mesh;
  material: THREE.MeshPhongMaterial;
  constructor(color: number) {
    //  Rendered size = Network Size * 2
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    this.material = new THREE.MeshPhongMaterial();
    this.material.color = new THREE.Color(color);
    this.mesh = new THREE.Mesh(geometry, this.material);
    this.mesh.receiveShadow = true;
    this.mesh.castShadow = true;
  }
  addToScene() {
    throw new Error("Method not implemented.");
  }
}

export class NetworkPlayer extends Player implements NetworkEntity {
  public nextPosition = new THREE.Vector3();
  public nextRotation = new THREE.Quaternion();

  constructor(public entityId: number, size: number, color: number) {
    super(size);
  }

  sync(position: SerializedPositionComponent) {
    this.nextPosition = new THREE.Vector3(position.x, position.y, position.z);
    // this.nextRotation = new THREE.Quaternion(
    //   data.rotation.x,
    //   data.rotation.y,
    //   data.rotation.z,
    //   data.rotation.w
    // );
  }
  update(lerpValue: number) {
    //  this.mesh.position.copy(this.nextPosition)
    //  this.mesh.rotation.setFromQuaternion(this.nextRotation)
    this.mesh.position.lerp(this.nextPosition, lerpValue);
    // this.mesh.quaternion.slerp(this.nextRotation, lerpValue);
  }
}
