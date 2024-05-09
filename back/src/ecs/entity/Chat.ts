import { SerializedEntityType } from "../../../../shared/network/server/serialized.js";
import { EntityManager } from "../../../../shared/entity/EntityManager.js";
import { Entity } from "../../../../shared/entity/Entity.js";

import { NetworkDataComponent } from "../component/NetworkDataComponent";

export class Chat {
  entity: Entity;

  constructor() {
    this.entity = EntityManager.getInstance().createEntity(
      SerializedEntityType.CHAT
    );

    const networkDataComponent = new NetworkDataComponent(
      this.entity.id,
      this.entity.type,
      []
    );
  }
}
