import { PositionComponent } from '../../../../../shared/component/PositionComponent.js'
import { RotationComponent } from '../../../../../shared/component/RotationComponent.js'
import { Entity } from '../../../../../shared/entity/Entity.js'
import { NetworkComponent } from '../../../../../shared/network/NetworkComponent.js'
import { DynamicPhysicsBodyComponent } from '../../component/DynamicPhysicsBodyComponent.js'
import { KinematicPhysicsBodyComponent } from '../../component/KinematicPhysicsBodyComponent.js'

export class SleepCheckSystem {
  update(entities: Entity[]) {
    for (const entity of entities) {
      const bodyComponent =
        entity.getComponent(DynamicPhysicsBodyComponent) ||
        entity.getComponent(KinematicPhysicsBodyComponent)
      this.sleepNetworkComponent(entity)
      if (bodyComponent) {
        const sleeping = bodyComponent.body.isSleeping()
        const positionComponent = entity.getComponent(PositionComponent)
        if (positionComponent) {
          positionComponent.updated = !sleeping
        }
        const rotationComponent = entity.getComponent(RotationComponent)
        if (rotationComponent) {
          rotationComponent.updated = !sleeping
        }
      }
    }
  }
  sleepNetworkComponent(entity: Entity) {
    const components = entity.getAllComponents()
    // Check if component is a NetworkComponent
    for (const component of components) {
      if (component instanceof NetworkComponent) {
        component.updated = false
      }
    }
  }
}
