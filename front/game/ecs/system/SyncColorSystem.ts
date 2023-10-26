import { ColorComponent } from "@shared/component/ColorComponent";
import { Entity } from "@shared/entity/Entity";
import * as THREE from "three";
import { MeshComponent } from "../component/MeshComponent";

export class SyncColorSystem {
  update(entities: Entity[]) {
    for (const entity of entities) {
      const colorComponent = entity.getComponent(ColorComponent);
      const meshComponent = entity.getComponent(MeshComponent);
      if (colorComponent && meshComponent) {
        meshComponent.mesh.material = new THREE.MeshPhongMaterial({
          color: colorComponent.color,
        });
      }
    }
  }
}
