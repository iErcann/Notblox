// NetworkSystem.ts

import { NetworkDataComponent } from "../../component/NetworkDataComponent.js";
import { WebSocketComponent } from "../../component/WebsocketComponent.js";
import { Entity } from "../../entity/entity.js";
import { pack } from "msgpackr";
import { WebsocketSystem } from "./WebsocketSystem.js";
import { WebSocket } from "uWebSockets.js";
import * as jsondiffpatch from "jsondiffpatch";
import * as fossilDelta from "fossil-delta";

export class NetworkSystem {
  private static instance: NetworkSystem;
  private websocketSystem: WebsocketSystem;
  private lastCompressedEntities: Buffer | undefined;
  private deltaPatcher = jsondiffpatch.create();

  private constructor() {
    this.websocketSystem = new WebsocketSystem();
  }

  public static getInstance() {
    if (!NetworkSystem.instance) {
      NetworkSystem.instance = new NetworkSystem();
    }
    return NetworkSystem.instance;
  }

  // Serialize components and send the entity's network data to clients
  public serializeAll(entities: Entity[]) {
    const serializedEntities: Object[] = [];

    entities.forEach((entity) => {
      const networkDataComponent =
        entity.getComponent<NetworkDataComponent>(NetworkDataComponent);

      if (networkDataComponent) {
        serializedEntities.push(networkDataComponent.serialize());
      }
    });

    return serializedEntities;
  }

  public update(entities: Entity[]) {
    const serializedEntities = this.serializeAll(entities);
    const compressedEntities = pack(serializedEntities);

    // if (!this.lastCompressedEntities) {
    //   this.lastCompressedEntities = compressedEntities;
    // }

    // console.log(fossilDelta);
    // const delta = fossilDelta.create(
    //   this.lastCompressedEntities,
    //   compressedEntities
    // );
    // this.broadcast(entities, delta);
    // this.lastCompressedEntities = compressedEntities;

    this.broadcast(entities, compressedEntities);
  }

  // Broadcast a message to all connected clients
  private broadcast(entities: Entity[], message: any) {
    entities.forEach((entity) => {
      const websocketComponent =
        entity.getComponent<WebSocketComponent>(WebSocketComponent);

      if (websocketComponent) {
        websocketComponent.ws.send(message, true);
      }
    });
  }
}
