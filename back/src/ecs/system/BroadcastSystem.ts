import { PositionComponent } from "../component/PositionComponent.js";
import { EntityManager } from "../entity/EntityManager.js";
import { Entity } from "../entity/entity.js";

export class BroadcastSystem {
  // This could be a WebSocket server or any other networking mechanism
  private networkServer: any;

  constructor(networkServer: any) {
    this.networkServer = networkServer;
  }

  update(entities: Entity[]): void {
    const playerPositions: {
      [entityId: number]: { x: number; y: number; z: number };
    } = {};

    for (const entity of entities) {
      const position =
        entity.getComponent<PositionComponent>(PositionComponent);
      if (position) {
        playerPositions[entity.id] = { ...position };
      }
    }

    const serializedData = JSON.stringify(playerPositions);
    // this.networkServer.broadcast(serializedData);
  }
}
