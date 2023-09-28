// NetworkSystem.ts

import { NetworkDataComponent } from "../../component/NetworkDataComponent.js";
import { WebSocketComponent } from "../../component/WebsocketComponent.js";
import { Entity } from "../../entity/entity.js";

export class NetworkSystem {
  private static instance: NetworkSystem;

  private constructor() {}

  public static getInstance() {
    if (!NetworkSystem.instance) {
      NetworkSystem.instance = new NetworkSystem();
    }
    return NetworkSystem.instance;
  }

  // Serialize components and send the entity's network data to clients
  public serializeAll(entities: Entity[]) {
    const serializedEntities: any[] = [];

    entities.forEach((entity) => {
      const networkDataComponent =
        entity.getComponent<NetworkDataComponent>(NetworkDataComponent);

      if (networkDataComponent) {
        serializedEntities.push(networkDataComponent.serialize());
      }
    });

    // Convert serializedEntities to JSON and send it to clients
    return JSON.stringify(serializedEntities);
  }

  public update(entities: Entity[]) {
    const serializedEntities = this.serializeAll(entities);
    this.broadcast(entities, serializedEntities);
  }
  // Broadcast a message to all connected clients
  private broadcast(entities: Entity[], message: string) {
    entities.forEach((entity) => {
      const websocketComponent =
        entity.getComponent<WebSocketComponent>(WebSocketComponent);

      if (websocketComponent) {
        websocketComponent.ws.send(message);
      }
    });
  }
}
