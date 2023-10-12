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
        const _serializedEntities =
          networkDataComponent.serialize(serializeAll);

        // This is to skip entities who doesn't have a single component in their array, might change in the future put lowers the badnwdith
        if (_serializedEntities != null)
          serializedEntities.push(_serializedEntities);
      }
    }
    return serializedEntities;
  }

  private buildSnapshotMessage(serializedEntities: SerializedEntity[]) {
    return pack({
      t: ServerMessageType.SNAPSHOT,
      e: serializedEntities,
    });
  }
  public update(entities: Entity[]): void {
    // First we find entities that just connected (Player)
    let fullSnapshotMessage: Buffer | undefined;
    for (const entity of entities) {
      const websocketComponent = entity.getComponent(WebSocketComponent);
      if (websocketComponent && !websocketComponent.isFirstSnapshotSent) {
        if (!fullSnapshotMessage) {
          const fullSerializedEntities = this.serialize(entities, true);
          fullSnapshotMessage = this.buildSnapshotMessage(
            fullSerializedEntities
          );
          console.log("Hasnt sent the first");
        }
        websocketComponent.ws.send(fullSnapshotMessage, true);
        websocketComponent.isFirstSnapshotSent = true;
      }
    }

    // Then we send delta snapshot
    const serializedEntities = this.serialize(entities, false);
    const snapshotMessage = this.buildSnapshotMessage(serializedEntities);
    this.broadcast(entities, snapshotMessage);
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
