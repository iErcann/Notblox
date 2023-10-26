import { ColorComponent } from "../../../../../shared/component/ColorComponent.js";
import { Entity } from "../../../../../shared/entity/Entity.js";
import { EventColorComponent } from "../../component/events/EventColorComponent.js";

export class SyncColorSystem {
  update(entities: Entity[]) {
    for (const entity of entities) {
      const colorComponent = entity.getComponent(ColorComponent);
      const eventColorComponent = entity.getComponent(EventColorComponent);

      if (colorComponent && eventColorComponent) {
        colorComponent.color = eventColorComponent.color;
        colorComponent.updated = true;
        entity.removeComponent(EventColorComponent);
      }
    }
  }
}
