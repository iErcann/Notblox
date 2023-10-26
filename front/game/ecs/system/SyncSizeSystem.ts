import { MeshComponent } from "../component/MeshComponent";
import { SizeComponent } from "@shared/component/SizeComponent";
import { Entity } from "@shared/entity/Entity";
import { SerializedEntityType } from "@shared/network/server/serialized";
import { BoxGeometry } from "three";

export class SyncSizeSystem {
  update(entities: Entity[]) {
    for (const entity of entities) {
      const meshComponent = entity.getComponent(MeshComponent);
      const sizeComponent = entity.getComponent(SizeComponent);

      if (meshComponent && sizeComponent) {
        if (entity.type === SerializedEntityType.CUBE) {
          // TODO: Fnd a proper way to fix this
          // Maybe rename "updated" boolean in networkcomponent to "updated"
          // When it is received by the client
          // The server should only send updated components to the client anyway
          // Right ?

          meshComponent.mesh.geometry.dispose(); // Avoids memory leak.
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
    }
  }
}
