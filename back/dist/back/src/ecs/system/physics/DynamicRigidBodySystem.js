import Rapier from '../../../physics/rapier.js';
import { ComponentAddedEvent } from '../../../../../shared/component/events/ComponentAddedEvent.js';
import { EventSystem } from '../../../../../shared/system/EventSystem.js';
import { ComponentRemovedEvent } from '../../../../../shared/component/events/ComponentRemovedEvent.js';
import { EntityManager } from '../../../../../shared/system/EntityManager.js';
import { PositionComponent } from '../../../../../shared/component/PositionComponent.js';
import { DynamicRigidBodyComponent } from '../../component/physics/DynamicRigidBodyComponent.js';
import { PlayerComponent } from '../../component/tag/TagPlayerComponent.js';
import { PhysicsPropertiesComponent } from '../../component/physics/PhysicsPropertiesComponent.js';
import { SizeComponent } from '../../../../../shared/component/SizeComponent.js';
import { SizeEvent } from '../../component/events/SizeEvent.js';
export class DynamicRigidBodySystem {
    world;
    constructor(world) {
        this.world = world;
    }
    update(entities) {
        const createEvents = EventSystem.getEventsWrapped(ComponentAddedEvent, DynamicRigidBodyComponent);
        for (const event of createEvents) {
            const entity = EntityManager.getEntityById(entities, event.entityId);
            if (!entity) {
                console.error('DynamicRigidBodySystem: Entity not found');
                continue;
            }
            this.onComponentAdded(entity, event);
        }
        const removedEvents = EventSystem.getEventsWrapped(ComponentRemovedEvent, DynamicRigidBodyComponent);
        for (const event of removedEvents) {
            this.onComponentRemoved(event);
        }
        const sizeEvents = EventSystem.getEvents(SizeEvent);
        for (const event of sizeEvents) {
            const entity = EntityManager.getEntityById(entities, event.entityId);
            if (entity) {
                this.handleSizeEvent(entity, event);
            }
        }
    }
    onComponentAdded(entity, event) {
        const physicsBodyComponent = event.component;
        const rbDesc = Rapier.RigidBodyDesc.dynamic();
        const positionComponent = entity.getComponent(PositionComponent);
        const rigidBody = this.world.createRigidBody(rbDesc);
        if (positionComponent) {
            rigidBody.setTranslation(new Rapier.Vector3(positionComponent.x, positionComponent.y, positionComponent.z), false);
        }
        physicsBodyComponent.body = rigidBody;
        if (entity.getComponent(PlayerComponent)) {
            physicsBodyComponent.body.enableCcd(true);
        }
        const physicsPropertiesComponent = entity.getComponent(PhysicsPropertiesComponent);
        if (physicsPropertiesComponent) {
            physicsBodyComponent.body.setAdditionalMass(physicsPropertiesComponent.mass, true);
        }
    }
    onComponentRemoved(event) {
        console.log('DynamicRigidBodySystem: Component removed');
        const physicsBodyComponent = event.component;
        if (physicsBodyComponent.body) {
            this.world.removeRigidBody(physicsBodyComponent.body);
        }
    }
    handleSizeEvent(entity, event) {
        const bodyComponent = entity.getComponent(DynamicRigidBodyComponent);
        const sizeComponent = entity.getComponent(SizeComponent);
        if (bodyComponent && bodyComponent.body && bodyComponent.collider && sizeComponent) {
            sizeComponent.width = event.width;
            sizeComponent.height = event.height;
            sizeComponent.depth = event.depth;
            sizeComponent.updated = true;
            this.updateScale(entity, { x: event.width, y: event.height, z: event.depth }, false);
        }
    }
    updateScale(entity, scale, isScaling) {
        const bodyComponent = entity.getComponent(DynamicRigidBodyComponent);
        if (bodyComponent && bodyComponent.body && bodyComponent.collider) {
            if (isScaling) {
                bodyComponent.collider.setSensor(true);
            }
            else {
                bodyComponent.setScale(scale.x, scale.y, scale.z, this.world);
                bodyComponent.collider.setSensor(false);
            }
        }
    }
    updatePosition(entity, position) {
        const bodyComponent = entity.getComponent(DynamicRigidBodyComponent);
        if (bodyComponent && bodyComponent.body) {
            bodyComponent.body.setTranslation(new Rapier.Vector3(position.x, position.y, position.z), true);
        }
    }
    updateRotation(entity, rotation) {
        const bodyComponent = entity.getComponent(DynamicRigidBodyComponent);
        if (bodyComponent && bodyComponent.body) {
            bodyComponent.body.setRotation(new Rapier.Quaternion(rotation.x, rotation.y, rotation.z, rotation.w), true);
        }
    }
}
//# sourceMappingURL=DynamicRigidBodySystem.js.map