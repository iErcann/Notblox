import { Game } from "@/game/game";
import { Entity } from "@shared/entity/Entity";
import { SerializedEntityType } from "@shared/network/server/serialized";
import { useEffect } from "react";

export class Chat {
  entity: Entity;
  constructor(entityId: number, game: Game) {
    this.entity = game.entityManager.createEntity(
      SerializedEntityType.CHAT,
      entityId
    );
  }
}
