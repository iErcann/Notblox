import { Entity } from "@shared/entity/Entity";
import { MeshComponent } from "../component/MeshComponent";
import * as THREE from "three";
import { SerializedEntityType } from "@shared/serialized";

export class Player {
  entity: Entity;
  constructor(entityId: number) {
    this.entity = new Entity(SerializedEntityType.PLAYER, entityId);
    this.entity.addComponent(new MeshComponent(entityId));
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshPhongMaterial();
    material.color = new THREE.Color(0xff0000);
    const mesh = this.entity.getComponent(MeshComponent)!.mesh;
    mesh.geometry = geometry;
    mesh.material = material;
    mesh.receiveShadow = true;
    mesh.castShadow = true;
  }
}
