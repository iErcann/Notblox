import { SizeComponent } from "../../../../shared/component/SizeComponent.js";
import { Entity } from "../../../../shared/entity/Entity.js";

export class UpdateSizeSystem {
  update(entities: Entity[]) {
    for (const entity of entities) {
      const sizeComponent = entity.getComponent(SizeComponent);
      if (sizeComponent) {
        // Implement random size change
        if (Math.random() < 0.001) {
          sizeComponent.width += 5;
          sizeComponent.height += 5;
          sizeComponent.updated = true;
        }
      }
    }
  }
}
