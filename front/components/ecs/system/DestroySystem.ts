import { Entity } from "../../../../shared/entity/Entity.js";
import { EventDestroyedComponent } from "../../../../shared/component/events/EventDestroyedComponent.js";
import { Game } from "@/components/game.js";
import { MeshComponent } from "../component/MeshComponent.js";
import { EntityManager } from "@shared/entity/EntityManager.js";
import { Renderer } from "@/components/renderer.js";

export class DestroySystem {
  update(entities: Entity[], entityManager: EntityManager, renderer: Renderer) {
    for (const entity of entities) {
      const destroyComponent = entity.getComponent(EventDestroyedComponent);
      if (destroyComponent) {
        const meshComponent = entity.getComponent(MeshComponent);
        console.log("Destroying", entity);
        if (meshComponent) {
          renderer.scene.remove(meshComponent.mesh);
        }

        entityManager.removeEntity(entity);
      }
    }
  }
}
