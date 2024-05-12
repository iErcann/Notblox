import { ColorComponent } from "../../../../../shared/component/ColorComponent.js";
import { Entity } from "../../../../../shared/entity/Entity.js";
import { EventColor } from "../../component/events/EventColor.js";

export class SyncColorSystem {
  update(entities: Entity[]) {
    for (const entity of entities) {
      const colorComponent = entity.getComponent(ColorComponent);
      const eventColorComponent = entity.getComponent(EventColor);

      if (colorComponent && eventColorComponent) {
        colorComponent.color = eventColorComponent.color;
        entity.removeComponent(EventColor);
      }
    }
  }
}
