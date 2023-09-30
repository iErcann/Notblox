import { Entity } from "@shared/entity/Entity";
import { MeshComponent } from "../component/MeshComponent";
import { PositionComponent } from "@shared/component/PositionComponent";

export class SyncPositionSystem {
  update(entities: Entity[]) {
    entities.forEach((entity) => {
      const meshComponent = entity.getComponent(MeshComponent);
      const positionComponent = entity.getComponent(PositionComponent);

      if (meshComponent && positionComponent) {
        meshComponent.mesh.position.x = positionComponent.x;
        meshComponent.mesh.position.y = positionComponent.y;
        meshComponent.mesh.position.z = positionComponent.z;
      }
    });
  }
}
