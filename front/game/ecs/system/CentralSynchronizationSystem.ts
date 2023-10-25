// import { SerializedEntityType } from "@shared/network/server/serialized";
// import { BoxGeometry } from "three";
// import { CubeSizeSyncModule } from "./SyncCubeSizeSystem";
// // import { PlayerSizeSyncModule } from "./PlayerSizeSyncModule";
// import { Entity } from "@shared/entity/Entity";
// import { MeshComponent } from "../component/MeshComponent";
// import { SizeComponent } from "@shared/component/SizeComponent";

// type EntitySynchronizationModule = (
//   meshComponent: MeshComponent,
//   sizeComponent: SizeComponent
// ) => void;

// export class CentralSynchronizationSystem {
//   private modules: Map<SerializedEntityType, EntitySynchronizationModule>;

//   constructor() {
//     this.modules = new Map<SerializedEntityType, EntitySynchronizationModule>([
//       [SerializedEntityType.CUBE, CubeSizeSyncModule],
//       // [SerializedEntityType.PLAYER, PlayerSizeSyncModule.synchronize],
//       // Add more modules for other entity types as needed
//     ]);
//   }

//   synchronizeVisualProperties(entity: Entity) {
//     const meshComponent = entity.getComponent(MeshComponent);
//     const sizeComponent = entity.getComponent(SizeComponent);

//     if (meshComponent && sizeComponent) {
//       const entityType = entity.type;
//       const syncModule = this.modules.get(entityType);

//       if (syncModule) {
//         syncModule(meshComponent, sizeComponent);
//       }
//     }
//   }
// }

/*

import { MeshComponent } from "../component/MeshComponent";
import { SizeComponent } from "@shared/component/SizeComponent";
import { BoxGeometry } from "three";

export class SyncCubeSizeSystem {
  synchronize(meshComponent: MeshComponent, sizeComponent: SizeComponent) {
    // Adjust the size of cubes
    const geometry = meshComponent.mesh.geometry as BoxGeometry;
    geometry.scale(
      sizeComponent.width,
      sizeComponent.height,
      sizeComponent.depth
    );
  }
}

*/
