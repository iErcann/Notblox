import { Packr } from 'msgpackr';
import { NetworkDataComponent } from '../../../../../shared/network/NetworkDataComponent.js';
import { ServerMessageType } from '../../../../../shared/network/server/base.js';
import { WebSocketComponent } from '../../component/WebsocketComponent.js';
import { WebsocketSystem } from './WebsocketSystem.js';
import pako from 'pako';
export class NetworkSystem {
    world;
    //  Serializes the given entities.
    static packr = new Packr({});
    websocketSystem;
    constructor(world) {
        this.world = world;
        this.websocketSystem = new WebsocketSystem(this.world);
    }
    serialize(entities, serializeAll) {
        const serializedEntities = [];
        for (const entity of entities) {
            const networkDataComponent = entity.getComponent(NetworkDataComponent);
            if (networkDataComponent) {
                const _serializedEntities = networkDataComponent.serialize(serializeAll);
                // Skip entities without any components to reduce bandwidth
                if (_serializedEntities != null) {
                    serializedEntities.push(_serializedEntities);
                }
            }
        }
        return serializedEntities;
    }
    static compress(message) {
        const msgpackrCompressed = NetworkSystem.packr.pack(message);
        return pako.deflate(msgpackrCompressed);
    }
    // Builds a snapshot message to send to the clients.
    buildSnapshotMessage(serializedEntities) {
        return NetworkSystem.compress({
            t: ServerMessageType.SNAPSHOT,
            e: serializedEntities,
        });
    }
    // Updates the network state and sends snapshots to clients.
    update(entities) {
        // Send full snapshot to newly connected clients
        let fullSnapshotMessage;
        for (const entity of entities) {
            const websocketComponent = entity.getComponent(WebSocketComponent);
            if (websocketComponent && !websocketComponent.isFirstSnapshotSent) {
                if (!fullSnapshotMessage) {
                    const fullSerializedEntities = this.serialize(entities, true);
                    fullSnapshotMessage = this.buildSnapshotMessage(fullSerializedEntities);
                }
                websocketComponent.ws.send(fullSnapshotMessage, true);
                websocketComponent.isFirstSnapshotSent = true;
            }
        }
        // Send delta snapshots to all clients
        const serializedEntities = this.serialize(entities, false);
        const snapshotMessage = this.buildSnapshotMessage(serializedEntities);
        this.broadcast(entities, snapshotMessage);
        // Call the WebsocketSystem update and cleanup method
        this.websocketSystem.updateAndCleanup();
    }
    // Broadcasts a message to all connected clients.
    broadcast(entities, message) {
        for (const entity of entities) {
            const websocketComponent = entity.getComponent(WebSocketComponent);
            if (websocketComponent) {
                if (!websocketComponent.ws) {
                    console.error('Websocket not found', websocketComponent);
                }
                else {
                    websocketComponent.ws.send(message, true);
                }
            }
        }
    }
}
//# sourceMappingURL=NetworkSystem.js.map