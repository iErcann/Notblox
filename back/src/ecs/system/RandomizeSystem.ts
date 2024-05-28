import { SingleSizeComponent } from '../../../../shared/component/SingleSizeComponent.js'
import { ColorComponent } from '../../../../shared/component/ColorComponent.js'
import { SizeComponent } from '../../../../shared/component/SizeComponent.js'
import { Entity } from '../../../../shared/entity/Entity.js'
import { BaseEventSystem } from '../../../../shared/system/EventSystem.js'
import Rapier from '../../physics/rapier.js'
import { DynamicRigidBodyComponent } from '../component/physics/DynamicRigidBodyComponent.js'
import { RandomizeComponent } from '../component/RandomizeComponent.js'
import { ColorEvent } from '../component/events/ColorEvent.js'
import { SizeEvent } from '../component/events/SizeEvent.js'
import { SingleSizeEvent } from '../component/events/SingleSizeEvent.js'

export class RandomizeSystem {
  update(entities: Entity[]) {
    for (const entity of entities) {
      if (!entity.getComponent(RandomizeComponent)) continue

      const sizeComponent = entity.getComponent(SizeComponent)
      if (sizeComponent) {
        if (Math.random() < 0.01) {
          BaseEventSystem.addEvent(
            new SizeEvent(entity.id, Math.random() * 4, Math.random() * 4, Math.random() * 4)
          )
        }
      }

      const singleSizeComponent = entity.getComponent(SingleSizeComponent)
      if (singleSizeComponent) {
        if (Math.random() < 0.05) {
          BaseEventSystem.addEvent(new SingleSizeEvent(entity.id, Math.max(0.5, Math.random() * 3)))
        }
      }

      const colorComponent = entity.getComponent(ColorComponent)

      if (colorComponent) {
        if (Math.random() < 0.01) {
          const randomHex = Math.floor(Math.random() * 16777215).toString(16)
          BaseEventSystem.addEvent(new ColorEvent(entity.id, '#' + randomHex))
        }
      }

      const rigidBodyComponent = entity.getComponent(DynamicRigidBodyComponent)

      if (rigidBodyComponent) {
        if (!rigidBodyComponent.body) {
          continue
        }
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
