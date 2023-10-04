// NetworkSystem.ts

import { WebSocketComponent } from "../../component/WebsocketComponent.js";
import { Entity } from "../../../../../shared/entity/Entity.js";
import { pack } from "msgpackr";
import { WebsocketSystem } from "./WebsocketSystem.js";
import { WebSocket } from "uWebSockets.js";
import * as jsondiffpatch from "jsondiffpatch";
import * as fossilDelta from "fossil-delta";
import {
  SnapshotMessage,
  SerializedEntity,
} from "../../../../../shared/network/server/serialized.js";
import { NetworkDataComponent } from "../../component/NetworkDataComponent.js";
import { ServerMessageType } from "../../../../../shared/network/server/base.js";

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
  public serializeAll(entities: Entity[]): SerializedEntity[] {
    const serializedEntities: SerializedEntity[] = [];

    entities.forEach((entity) => {
      const networkDataComponent = entity.getComponent(NetworkDataComponent);

      if (networkDataComponent) {
        serializedEntities.push(networkDataComponent.serialize());
      }
    });

    return serializedEntities;
  }

  public update(entities: Entity[]) {
    const serializedEntities = this.serializeAll(entities);

    const snapshot: SnapshotMessage = {
      t: ServerMessageType.SNAPSHOT,
      e: serializedEntities,
    };
    const compressedSnapshot = pack(snapshot);

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

    this.broadcast(entities, compressedSnapshot);
  }

  // Broadcast a message to all connected clients
  private broadcast(entities: Entity[], message: any) {
    entities.forEach((entity) => {
      const websocketComponent = entity.getComponent(WebSocketComponent);

      if (websocketComponent) {
        console.log("Found entity", entity.id);
        websocketComponent.ws.send(message, true);
      }
    });
  }
}
