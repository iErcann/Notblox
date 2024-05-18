import { NetworkComponent } from '../../../../../shared/network/NetworkComponent.js'
import { ColorComponent } from '../../../../../shared/component/ColorComponent.js'
import { PositionComponent } from '../../../../../shared/component/PositionComponent.js'
import { RotationComponent } from '../../../../../shared/component/RotationComponent.js'
import { SizeComponent } from '../../../../../shared/component/SizeComponent.js'
import { Entity } from '../../../../../shared/entity/Entity.js'
import { PhysicsBodyComponent } from '../../component/PhysicsBodyComponent.js'

export class SleepCheckSystem {
  update(entities: Entity[]) {
    for (const entity of entities) {
      const bodyComponent = entity.getComponent(PhysicsBodyComponent)
      this.sleepNetworkComponent(entity)
      // https://github.com/dimforge/rapier/blob/af1ac9baa26b1199ae2728e91adf5345bcd1c693/src/dynamics/rigid_body_components.rs#L1030
      // Rapier doesn't expose the treshold or the time to sleep
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
