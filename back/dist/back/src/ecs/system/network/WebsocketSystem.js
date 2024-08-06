import { App, DEDICATED_COMPRESSOR_3KB, SSLApp, } from 'uWebSockets.js';
import { EntityManager } from '../../../../../shared/system/EntityManager.js';
import { EntityDestroyedEvent } from '../../../../../shared/component/events/EntityDestroyedEvent.js';
import { ClientMessageType } from '../../../../../shared/network/client/base.js';
import { DynamicRigidBodyComponent } from '../../component/physics/DynamicRigidBodyComponent.js';
import { unpack } from 'msgpackr';
import { ServerMessageType } from '../../../../../shared/network/server/base.js';
import { EventSystem } from '../../../../../shared/system/EventSystem.js';
import { ChatMessageEvent } from '../../component/events/ChatMessageEvent.js';
import { Player } from '../../entity/Player.js';
import { InputProcessingSystem } from '../InputProcessingSystem.js';
import { NetworkSystem } from './NetworkSystem.js';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { WebSocketComponent } from '../../component/WebsocketComponent.js';
import { DynamicRigidBodySystem } from '../physics/DynamicRigidBodySystem.js';
import { SizeEvent } from '../../component/events/SizeEvent.js';
export class WebsocketSystem {
    port = 8001;
    players = [];
    messageHandlers = new Map();
    inputProcessingSystem = new InputProcessingSystem();
    limiter = new RateLimiterMemory({
        points: 10,
        duration: 1,
    });
    world;
    dynamicRigidBodySystem;
    constructor(world) {
        this.world = world;
        this.dynamicRigidBodySystem = new DynamicRigidBodySystem(world);
        this.initializeServer();
        this.initializeMessageHandlers();
    }
    async isRateLimited(ip) {
        try {
            await this.limiter.consume(ip);
            return false;
        }
        catch (rejRes) {
            return true;
        }
    }
    initializeServer() {
        const isProduction = process.env.NODE_ENV === 'production';
        const acceptedOrigin = process.env.FRONTEND_URL;
        const app = isProduction
            ? SSLApp({
                key_file_name: '/etc/letsencrypt/live/npm-1/privkey.pem',
                cert_file_name: '/etc/letsencrypt/live/npm-1/cert.pem',
            })
            : App();
        app.ws('/*', {
            idleTimeout: 32,
            maxBackpressure: 1024,
            maxPayloadLength: 512,
            compression: DEDICATED_COMPRESSOR_3KB,
            message: this.onMessage.bind(this),
            open: this.onConnect.bind(this),
            drain: this.onDrain.bind(this),
            close: this.onClose.bind(this),
            upgrade: this.upgradeHandler.bind(this, isProduction, acceptedOrigin),
        });
        app.listen(this.port, this.listenHandler.bind(this));
    }
    upgradeHandler(isProduction, acceptedOrigin, res, req, context) {
        const origin = req.getHeader('origin');
        if (isProduction && acceptedOrigin && origin !== acceptedOrigin) {
            res.writeStatus('403 Forbidden').end();
            return;
        }
        res.upgrade({}, req.getHeader('sec-websocket-key'), req.getHeader('sec-websocket-protocol'), req.getHeader('sec-websocket-extensions'), context);
    }
    listenHandler(listenSocket) {
        if (listenSocket) {
            console.log(`WebSocket server listening on port ${this.port}`);
        }
        else {
            console.error(`Failed to listen on port ${this.port}`);
        }
    }
    initializeMessageHandlers() {
        this.addMessageHandler(ClientMessageType.INPUT, this.handleInputMessage.bind(this));
        this.addMessageHandler(ClientMessageType.CHAT_MESSAGE, this.handleChatMessage.bind(this));
        this.addMessageHandler(ClientMessageType.ENTITY_POSITION_UPDATE, this.handlePositionUpdate.bind(this));
        this.addMessageHandler(ClientMessageType.ENTITY_ROTATION_UPDATE, this.handleRotationUpdate.bind(this));
        this.addMessageHandler(ClientMessageType.ENTITY_SCALE_UPDATE, this.handleScaleUpdate.bind(this));
    }
    addMessageHandler(type, handler) {
        this.messageHandlers.set(type, handler);
    }
    removeMessageHandler(type) {
        this.messageHandlers.delete(type);
    }
    onMessage(ws, message) {
        const clientMessage = unpack(message);
        const handler = this.messageHandlers.get(clientMessage.t);
        if (handler) {
            handler(ws, clientMessage);
        }
    }
    async onConnect(ws) {
        const ipBuffer = ws.getRemoteAddressAsText();
        const ip = Buffer.from(ipBuffer).toString();
        if (await this.isRateLimited(ip)) {
            return ws.close(429, 'Rate limit exceeded');
        }
        const player = new Player(ws, Math.random() * 5, 10, Math.random() * 5);
        const connectionMessage = {
            t: ServerMessageType.FIRST_CONNECTION,
            id: player.entity.id,
        };
        ws.player = player;
        ws.send(NetworkSystem.compress(connectionMessage), true);
        EventSystem.addEvent(new ChatMessageEvent(player.entity.id, '🖥️ [SERVER]', `Player ${player.entity.id} joined at ${new Date().toLocaleString()}`));
        this.players.push(player);
    }
    onDrain(ws) {
        console.log('WebSocket backpressure: ' + ws.getBufferedAmount());
    }
    onClose(ws) {
        const disconnectedPlayer = ws.player;
        if (!disconnectedPlayer) {
            console.error('Disconnect: Player not found?', ws);
            return;
        }
        console.log('Disconnect: Player found!');
        const entity = disconnectedPlayer.entity;
        const entityId = entity.id;
        EventSystem.addNetworkEvent(new EntityDestroyedEvent(entityId));
    }
    async handleInputMessage(ws, message) {
        const player = ws.player;
        if (!player) {
            console.error(`Player with WS ${ws} not found.`);
            return;
        }
        const { u, d, l, r, s, y } = message;
        if (typeof u !== 'boolean' ||
            typeof d !== 'boolean' ||
            typeof l !== 'boolean' ||
            typeof r !== 'boolean' ||
            typeof s !== 'boolean' ||
            typeof y !== 'number') {
            console.error('Invalid input message', message);
            return;
        }
        this.inputProcessingSystem.receiveInputPacket(player.entity, message);
    }
    handleChatMessage(ws, message) {
        console.log('Chat message received', message);
        const player = ws.player;
        const id = player.entity.id;
        const { content } = message;
        if (!content || typeof content !== 'string') {
            console.error(`Invalid chat message, sent from ${player}`, message);
            return;
        }
        EventSystem.addEvent(new ChatMessageEvent(id, `Player ${id}`, content));
    }
    handlePositionUpdate(ws, message) {
        const { entityId, x, y, z } = message;
        const entity = EntityManager.getEntityById(EntityManager.getInstance().getAllEntities(), entityId);
        if (entity) {
            const bodyComponent = entity.getComponent(DynamicRigidBodyComponent);
            if (bodyComponent) {
                this.dynamicRigidBodySystem.updatePosition(entity, { x, y, z });
                this.broadcastUpdate(message);
            }
            else {
                console.error(`Entity ${entityId} does not have a valid DynamicRigidBodyComponent`);
            }
        }
        else {
            console.error(`Entity with id ${entityId} not found`);
        }
    }
    handleRotationUpdate(ws, message) {
        const { entityId, x, y, z } = message;
        const entity = EntityManager.getEntityById(EntityManager.getInstance().getAllEntities(), entityId);
        if (entity) {
            const bodyComponent = entity.getComponent(DynamicRigidBodyComponent);
            if (bodyComponent) {
                this.dynamicRigidBodySystem.updateRotation(entity, { x, y, z, w: 1 }); // Add a default w value
                this.broadcastUpdate(message);
            }
            else {
                console.error(`Entity ${entityId} does not have a valid DynamicRigidBodyComponent`);
            }
        }
        else {
            console.error(`Entity with id ${entityId} not found`);
        }
    }
    handleScaleUpdate(ws, message) {
        const { entityId, x, y, z } = message;
        const entity = EntityManager.getEntityById(EntityManager.getInstance().getAllEntities(), entityId);
        if (entity) {
            this.dynamicRigidBodySystem.updateScale(entity, { x, y, z }, false);
            EventSystem.addEvent(new SizeEvent(entityId, x, y, z));
            console.log(`Applied scale update for entity ${entityId}: ${x}, ${y}, ${z}`);
            this.broadcastUpdate(message);
        }
        else {
            console.error(`Entity with id ${entityId} not found`);
        }
    }
    broadcastUpdate(message) {
        this.players.forEach(player => {
            if (player.entity.id !== message.entityId) {
                const wsComponent = player.entity.getComponent(WebSocketComponent);
                if (wsComponent && wsComponent.ws && typeof wsComponent.ws.send === 'function') {
                    wsComponent.ws.send(NetworkSystem.compress(message), true);
                }
                else {
                    console.error(`Player ${player.entity.id} has an invalid WebSocket connection`);
                }
            }
        });
    }
}
//# sourceMappingURL=WebsocketSystem.js.map