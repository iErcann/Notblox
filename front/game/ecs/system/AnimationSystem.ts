import { Entity } from "@shared/entity/Entity";
import { AnimationComponent } from "../component/AnimationComponent";

export class AnimationSystem {
  update(dt: number, entities: Entity[]) {
    for (const entity of entities) {
      const animationComponent = entity.getComponent(AnimationComponent);

      if (animationComponent) {
        animationComponent.mixer.update(dt / 1000);
      }
    }
  }
}
