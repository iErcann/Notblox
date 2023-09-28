// NetworkSystem.ts

import { NetworkDataComponent } from "../../component/NetworkDataComponent.js";
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
    const message = JSON.stringify(serializedEntities);
    this.broadcast(message);
  }

  // Broadcast a message to all connected clients (implementation not shown here)
  private broadcast(message: string) {
    console.log("Simulating broadcast..");
    console.log(message);
  }
}
