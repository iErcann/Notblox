import { Entity } from "@shared/entity/Entity";
import { MeshComponent } from "../component/MeshComponent";

class Player {
  entity: Entity;

  constructor(entityId: number) {
    this.entity = new Entity(entityId);
    this.entity.addComponent(new MeshComponent(entityId));
  }
}
