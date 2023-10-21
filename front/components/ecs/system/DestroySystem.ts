import { Entity } from "../../../../shared/entity/Entity.js";
import { DestroyedComponent } from "../../../../shared/component/DestroyedComponent.js";
import { Game } from "@/components/game.js";
import { MeshComponent } from "../component/MeshComponent.js";

export class DestroySystem {
  update(entities: Entity[], game: Game) {
    for (const entity of entities) {
      const destroyComponent = entity.getComponent(DestroyedComponent);
      if (destroyComponent) {
        const meshComponent = entity.getComponent(MeshComponent);

        if (meshComponent) {
          game.renderer.scene.remove(meshComponent.mesh);
        }

        game.entityManager.removeEntity(entity);
      }
    }
  }
}
