import { Entity } from '@shared/entity/Entity'
import { AnimationComponent } from '../component/AnimationComponent'
import { StateComponent } from '@shared/component/StateComponent'
import { MeshComponent } from '../component/MeshComponent'

export class AnimationSystem {
  update(dt: number, entities: Entity[]) {
    for (const entity of entities) {
      const animationComponent = entity.getComponent(AnimationComponent)
      const meshComponent = entity.getComponent(MeshComponent)
      const stateComponent = entity.getComponent(StateComponent)

      if (animationComponent && stateComponent && meshComponent) {
        const mesh = meshComponent.mesh
        const animations = mesh.animations

        const isNotPlaying = animationComponent.mixer.time === 0

        if (stateComponent.updated || isNotPlaying) {
          // Find the animation that corresponds to the current state
          const requestAnimationName = stateComponent.state

          for (const clip of animations) {
            const action = animationComponent.mixer.clipAction(clip)
            if (clip.name !== requestAnimationName) {
              // Fade out all animations except the one corresponding to the current state
              action.fadeOut(0.2)
            } else {
              // Fade in and play the animation corresponding to the current state
              action.reset()

              action.fadeIn(0.1)

              action.play()
            }
          }
        }

        animationComponent.mixer.update(dt / 1000)
      }
    }
  }
}
