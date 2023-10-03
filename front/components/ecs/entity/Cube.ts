import { SerializedEntityType } from "@shared/network/server/serialized";
import { EntityManager } from "./EntityManager";
import { Entity } from "@shared/entity/Entity";
import { MeshComponent } from "../component/MeshComponent";
import * as THREE from "three";

export class Cube {
  entity: Entity;
  constructor(entityId: number) {
    this.entity = EntityManager.getInstance().createEntity(
      SerializedEntityType.CUBE,
      entityId
    );

    const meshComponent = new MeshComponent(entityId);
    this.entity.addComponent(meshComponent);
    const mesh = meshComponent.mesh;
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshPhongMaterial();
    material.color = new THREE.Color(0xffffff);
    mesh.geometry = geometry;
    mesh.material = material;
    mesh.receiveShadow = true;
    mesh.castShadow = true;
  }
}
