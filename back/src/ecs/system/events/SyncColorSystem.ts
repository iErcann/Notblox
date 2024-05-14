import { EntityManager } from "../../../../../shared/entity/EntityManager.js";
import { ColorComponent } from "../../../../../shared/component/ColorComponent.js";
import { Entity } from "../../../../../shared/entity/Entity.js";
import { EventColor } from "../../component/events/EventColor.js";

export class SyncColorSystem {
  update(entities: Entity[], eventColor: EventColor) {
    const entity = EntityManager.getEntityById(entities, eventColor.entityId);
    if (!entity) return;

    const colorComponent = entity.getComponent(ColorComponent);
    if (!colorComponent) return;

    if (colorComponent && eventColor) {
      colorComponent.color = eventColor.color;
      colorComponent.updated = true;
    }
  }
}
