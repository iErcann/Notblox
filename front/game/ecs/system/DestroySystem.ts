import { Entity } from "../../../../shared/entity/Entity.js";
import { EventDestroyedComponent } from "../../../../shared/component/events/EventDestroyedComponent.js";
import { Game } from "@/game/game.js";
import { MeshComponent } from "../component/MeshComponent.js";
import { EntityManager } from "@shared/entity/EntityManager.js";
import { Renderer } from "@/game/renderer.js";
import { TextComponent } from "../component/TextComponent.js";
import { SerializedComponent } from "@shared/network/server/serialized.js";

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

        const textComponent = entity.getComponent(TextComponent);
        if (textComponent) {
          textComponent.textObject.element.remove();
        }

        entityManager.removeEntity(entity);
      }
    }
  }
}

export interface SerializedDestroyedComponent extends SerializedComponent {}
