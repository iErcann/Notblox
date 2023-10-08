import { MeshComponent } from "../component/MeshComponent";
import { SizeComponent } from "@shared/component/SizeComponent";
import { Entity } from "@shared/entity/Entity";
import { SerializedEntityType } from "@shared/network/server/serialized";
import { BoxGeometry } from "three";

export class SyncSizeSystem {
  update(entities: Entity[]) {
    entities.forEach((entity) => {
      const meshComponent = entity.getComponent(MeshComponent);
      const sizeComponent = entity.getComponent(SizeComponent);

      if (meshComponent && sizeComponent) {
        if (entity.type === SerializedEntityType.CUBE) {
          // TODO: Fnd a proper way to fix this
          meshComponent.mesh.geometry = new BoxGeometry(
            sizeComponent.width * 2,
            sizeComponent.height * 2,
            sizeComponent.depth * 2
          );
          // const geometry = meshComponent.mesh.geometry as BoxGeometry;
          // geometry.scale(
          //   sizeComponent.width,
          //   sizeComponent.height,
          //   sizeComponent.depth
          // );
        }
      }
    });
  }
}
