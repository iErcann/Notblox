import { EntityManager } from "../../../../shared/entity/EntityManager.js";
import { Entity } from "../../../../shared/entity/Entity.js";
import { SerializedEntityType } from "../../../../shared/network/server/serialized.js";
import { EventTrimeshComponent } from "../component/events/EventTrimeshComponent.js";

export class MapWorld {
  entity: Entity;
  constructor() {
    this.entity = EntityManager.getInstance().createEntity(
      SerializedEntityType.WORLD
    );

    this.entity.addComponent(
      new EventTrimeshComponent(
        this.entity.id,
        "https://myaudio.nyc3.cdn.digitaloceanspaces.com/ClearedSanAndreas.glb"
      )
    );
  }
}
