import { Entity } from '@shared/entity/Entity'
import { NetworkComponent } from '@shared/network/NetworkComponent'

export class SleepCheckSystem {
  update(entities: Entity[]) {
    for (const entity of entities) {
      this.sleepNetworkComponent(entity)
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
