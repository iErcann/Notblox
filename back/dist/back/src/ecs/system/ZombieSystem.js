import { ZombieComponent } from '../component/ZombieComponent.js';
import { ColorComponent } from '../../../../shared/component/ColorComponent.js';
import { PositionComponent } from '../../../../shared/component/PositionComponent.js';
import { EventSystem } from '../../../../shared/system/EventSystem.js';
import { Vector3 } from 'three';
import { PlayerComponent } from '../component/tag/TagPlayerComponent.js';
import Rapier from '../../physics/rapier.js';
import { DynamicRigidBodyComponent } from '../component/physics/DynamicRigidBodyComponent.js';
import { ColorEvent } from '../component/events/ColorEvent.js';
export class ZombieSystem {
    followDistance = 20;
    wanderRadius = 10;
    wanderTime = 0;
    wanderInterval = 2;
    update(dt, entities) {
        const players = [];
        for (const entity of entities) {
            if (entity.getComponent(PlayerComponent)) {
                players.push(entity);
            }
        }
        for (const entity of entities) {
            if (entity.getComponent(ZombieComponent)) {
                this.processZombieEntity(entity, players, dt);
            }
        }
    }
    processZombieEntity(entity, players, dt) {
        const rigidBodyComponent = entity.getComponent(DynamicRigidBodyComponent);
        const positionComponent = entity.getComponent(PositionComponent);
        const colorComponent = entity.getComponent(ColorComponent);
        if (!rigidBodyComponent || !positionComponent || !colorComponent) {
            return; // Skip processing this entity if any required component is missing
        }
        const nearbyPlayers = this.findNearbyPlayers(players, positionComponent);
        if (nearbyPlayers.length === 0) {
            this.wander(entity, rigidBodyComponent, dt);
            this.handleDistantProximity(entity, colorComponent);
            return;
        }
        for (const player of nearbyPlayers) {
            const direction = this.calculateDirection(player, positionComponent);
            this.handleCloseProximity(entity, direction, rigidBodyComponent, colorComponent, dt);
        }
    }
    findNearbyPlayers(players, positionComponent) {
        const nearbyPlayers = [];
        for (const player of players) {
            const playerPosition = player.getComponent(PositionComponent);
            if (!playerPosition)
                continue;
            const dx = playerPosition.x - positionComponent.x;
            const dy = playerPosition.y - positionComponent.y;
            const dz = playerPosition.z - positionComponent.z;
            const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
            if (distance < this.followDistance) {
                nearbyPlayers.push(player);
            }
        }
        return nearbyPlayers;
    }
    calculateDirection(target, sourcePosition) {
        const targetPosition = target.getComponent(PositionComponent);
        if (!targetPosition)
            return new Vector3(0, 0, 0);
        const direction = new Vector3(targetPosition.x - sourcePosition.x, targetPosition.y - sourcePosition.y, targetPosition.z - sourcePosition.z);
        direction.normalize();
        return direction;
    }
    handleCloseProximity(entity, direction, rigidBodyComponent, colorComponent, dt) {
        if (!rigidBodyComponent.body) {
            return;
        }
        direction.multiplyScalar(0.3 * dt);
        const impulse = new Rapier.Vector3(direction.x, rigidBodyComponent.body.linvel().y, direction.z);
        rigidBodyComponent.body.setLinvel(impulse, true);
        // Dirty state
        if (colorComponent.color !== '#ff0000') {
            this.setZombieToRed(entity);
        }
    }
    handleDistantProximity(entity, colorComponent) {
        // Dirty state
        if (colorComponent.color !== '#00ff00') {
            this.setZombieToGreen(entity);
        }
    }
    setZombieToRed(entity) {
        EventSystem.addEvent(new ColorEvent(entity.id, '#ff0000'));
    }
    setZombieToGreen(entity) {
        EventSystem.addEvent(new ColorEvent(entity.id, '#00ff00'));
    }
    wander(entity, rigidBodyComponent, dt) {
        if (!rigidBodyComponent.body) {
            return;
        }
        this.wanderTime += dt;
        if (this.wanderTime > this.wanderInterval) {
            this.wanderTime = 0;
            const angle = Math.random() * Math.PI * 2;
            const wanderDirection = new Vector3(Math.cos(angle) * this.wanderRadius, 0, Math.sin(angle) * this.wanderRadius);
            wanderDirection.normalize();
            wanderDirection.multiplyScalar(1.1 * dt);
            const impulse = new Rapier.Vector3(wanderDirection.x, wanderDirection.y, wanderDirection.z);
            rigidBodyComponent.body.applyImpulse(impulse, true);
        }
    }
}
//# sourceMappingURL=ZombieSystem.js.map