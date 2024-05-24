import { ColorComponent } from '../../../../shared/component/ColorComponent.js'
import { SizeComponent } from '../../../../shared/component/SizeComponent.js'
import { Entity } from '../../../../shared/entity/Entity.js'
import { BaseEventSystem } from '../../../../shared/entity/EventSystem.js'
import Rapier from '../../physics/rapier.js'
import { PhysicsBodyComponent } from '../component/PhysicsBodyComponent.js'
import { RandomizeComponent } from '../component/RandomizeComponent.js'
import { EventColor } from '../component/events/EventColor.js'

export class RandomSizeSystem {
  update(entities: Entity[]) {
    for (const entity of entities) {
      if (!entity.getComponent(RandomizeComponent)) continue

      const eventSystem = BaseEventSystem
      const sizeComponent = entity.getComponent(SizeComponent)
      // if (sizeComponent) {
      //   if (Math.random() < 0.01) {
      //     const { width, height, depth } = sizeComponent;
      //     eventSystem.addEvent(
      //       new EventSize(
      //         entity.id,
      //         (width + 0.5) % 5,
      //         (height + 0.5) % 5,
      //         (depth + 0.5) % 5
      //       )
      //     );
      //   }
      // }

      // const singleSizeComponent = entity.getComponent(SingleSizeComponent);
      // if (singleSizeComponent) {
      //   if (Math.random() < 0.01) {
      //     const { size } = singleSizeComponent;
      //     const eventSizeComponent = new EventSingleSize(
      //       entity.id,
      //       Math.max(0.5, Math.random() * 3)
      //     );
      //     eventSystem.addEvent(eventSizeComponent);
      //   }
      // }

      const colorComponent = entity.getComponent(ColorComponent)

      if (colorComponent) {
        if (Math.random() < 0.01) {
          const randomHex = Math.floor(Math.random() * 16777215).toString(16)
          eventSystem.addEvent(new EventColor(entity.id, '#' + randomHex))
        }
      }

      const rigidBodyComponent = entity.getComponent(PhysicsBodyComponent)

      if (rigidBodyComponent) {
        if (Math.random() < 0.05) {
          rigidBodyComponent.body.applyImpulse(
            new Rapier.Vector3(
              (Math.random() - 1 / 2) * 750,
              (Math.random() - 1 / 2) * 750,
              (Math.random() - 1 / 2) * 750
            ),
            true
          )
        }
      }
    }
  }
}
