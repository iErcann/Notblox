import { WebSocketComponent } from "../../component/WebsocketComponent.js";
import { Entity } from "../../../../../shared/entity/Entity.js";
import { pack } from "msgpackr";
import { WebsocketSystem } from "./WebsocketSystem.js";
import * as jsondiffpatch from "jsondiffpatch";
import {
  SnapshotMessage,
  SerializedEntity,
} from "../../../../../shared/network/server/serialized.js";
import { NetworkDataComponent } from "../../component/NetworkDataComponent.js";
import { ServerMessageType } from "../../../../../shared/network/server/base.js";

export class NetworkSystem {
  private static instance: NetworkSystem;
  private websocketSystem: WebsocketSystem;
  private deltaPatcher = jsondiffpatch.create();

  private constructor() {
    this.websocketSystem = new WebsocketSystem();
  }

  public static getInstance(): NetworkSystem {
    if (!NetworkSystem.instance) {
      NetworkSystem.instance = new NetworkSystem();
    }
    return NetworkSystem.instance;
  }

  private serialize(entities: Entity[], serializeAll: boolean) {
    const serializedEntities: SerializedEntity[] = [];

    for (const entity of entities) {
      const networkDataComponent = entity.getComponent(NetworkDataComponent);

      if (networkDataComponent) {
        serializeAll;
        serializedEntities.push(networkDataComponent.serialize(serializeAll));
      }
    }
    return serializedEntities;
  }

  public update(entities: Entity[]): void {
    const serializedEntities = this.serialize(entities, false);
    const snapshot: SnapshotMessage = {
      t: ServerMessageType.SNAPSHOT,
      e: serializedEntities,
    };

    let fullSerializedEntities: SerializedEntity[] | undefined;
    for (const entity of entities) {
      const websocketComponent = entity.getComponent(WebSocketComponent);
      if (websocketComponent && !websocketComponent.isFirstSnapshotSent) {
        if (!fullSerializedEntities)
          fullSerializedEntities = this.serialize(entities, true);

        websocketComponent.ws.send(
          pack({
            t: ServerMessageType.SNAPSHOT,
            e: fullSerializedEntities,
          }),
          true
        );

        websocketComponent.isFirstSnapshotSent = true;
      }
    }

    const compressedSnapshot = pack(snapshot);
    this.broadcast(entities, compressedSnapshot);
  }

  // Broadcast a message to all connected clients
  private broadcast(entities: Entity[], message: any): void {
    for (const entity of entities) {
      const websocketComponent = entity.getComponent(WebSocketComponent);
      if (websocketComponent) {
        websocketComponent.ws.send(message, true);
      }
    }
  }
}
