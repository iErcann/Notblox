import { Entity } from "@shared/entity/Entity";
import { AnimationComponent } from "../component/AnimationComponent";
import { StateComponent } from "@shared/component/StateComponent";
import { MeshComponent } from "../component/MeshComponent";

export class AnimationSystem {
  update(dt: number, entities: Entity[]) {
    for (const entity of entities) {
      const animationComponent = entity.getComponent(AnimationComponent);
      const meshComponent = entity.getComponent(MeshComponent);
      const stateComponent = entity.getComponent(StateComponent);

      if (animationComponent && stateComponent && meshComponent) {
        const mesh = meshComponent.mesh;
        const animations = mesh.animations;

        const isNotPlaying = animationComponent.mixer.time === 0;

        if (stateComponent.updated || isNotPlaying) {
          // find the animation that corresponds to the current state
          const animationName = stateComponent.state;
          const animation = animations.find(
            (clip) => clip.name === animationName
          );

          if (animation) {
            animationComponent.mixer.stopAllAction();
            const action = animationComponent.mixer.clipAction(animation);
            action.play();
          } else {
            console.error(
              "Animation not found for state: " + stateComponent.state,
              animations
            );
          }
        }

        animationComponent.mixer.update(dt / 1000);
      }
    }
  }
}
