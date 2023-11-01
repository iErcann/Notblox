import { NetworkComponent } from "../../../../../shared/network/NetworkComponent.js";
import { ColorComponent } from "../../../../../shared/component/ColorComponent.js";
import { PositionComponent } from "../../../../../shared/component/PositionComponent.js";
import { RotationComponent } from "../../../../../shared/component/RotationComponent.js";
import { SizeComponent } from "../../../../../shared/component/SizeComponent.js";
import { Entity } from "../../../../../shared/entity/Entity.js";
import { PhysicsBodyComponent } from "../../component/PhysicsBodyComponent.js";

export class SleepCheckSystem {
  update(entities: Entity[]) {
    for (const entity of entities) {
      const bodyComponent = entity.getComponent(PhysicsBodyComponent);
      this.sleepAllNetworkComponent(entity);
      if (bodyComponent) {
        const sleeping = bodyComponent.body.isSleeping();
        const positionComponent = entity.getComponent(PositionComponent);
        if (positionComponent) {
          positionComponent.updated = !sleeping;
        }
        const rotationComponent = entity.getComponent(RotationComponent);
        if (rotationComponent) {
          rotationComponent.updated = !sleeping;
        }
      }
    }
  }
  sleepAllNetworkComponent(entity: Entity) {
    const components = entity.getAllComponents();
    // Check if component is a NetworkComponent
    for (const component of components) {
      if (component instanceof NetworkComponent) {
        component.updated = false;
      }
    }
  }
}
