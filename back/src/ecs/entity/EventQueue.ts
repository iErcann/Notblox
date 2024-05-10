import { EntityManager } from "../../../../shared/entity/EntityManager.js";
import { Entity } from "../../../../shared/entity/Entity.js";
import { SerializedEntityType } from "../../../../shared/network/server/serialized.js";

export class EventQueue {
  entity: Entity;
  constructor() {
    this.entity = EntityManager.getInstance().createEntity(
      SerializedEntityType.EVENT
    );
  }
}
