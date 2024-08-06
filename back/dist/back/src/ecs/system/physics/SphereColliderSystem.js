import { SingleSizeComponent } from '../../../../../shared/component/SingleSizeComponent.js';
import { ComponentAddedEvent } from '../../../../../shared/component/events/ComponentAddedEvent.js';
import { EntityManager } from '../../../../../shared/system/EntityManager.js';
import { EventSystem } from '../../../../../shared/system/EventSystem.js';
import Rapier from '../../../physics/rapier.js';
import { DynamicRigidBodyComponent } from '../../component/physics/DynamicRigidBodyComponent.js';
import { KinematicRigidBodyComponent } from '../../component/physics/KinematicRigidBodyComponent.js';
import { SphereColliderComponent } from '../../component/physics/SphereColliderComponent.js';
export class SphereColliderSystem {
    async update(entities, world) {
        const createEvents = EventSystem.getEventsWrapped(ComponentAddedEvent, SphereColliderComponent);
        for (const event of createEvents) {
            const entity = EntityManager.getEntityById(entities, event.entityId);
            if (!entity) {
                console.error('SphereColliderSystem: Entity not found');
                continue;
            }
            this.onComponentAdded(entity, event, world);
        }
    }
    onComponentAdded(entity, event, world) {
        const { component: sphereColliderComponent } = event;
        let singleSizeComponent = entity.getComponent(SingleSizeComponent);
        const rigidBodyComponent = entity.getComponent(DynamicRigidBodyComponent) ||
            entity.getComponent(KinematicRigidBodyComponent);
        if (!rigidBodyComponent) {
            console.error('SphereColliderSystem : No RigidBodyComponent found on entity.');
            return;
        }
        if (!singleSizeComponent) {
            singleSizeComponent = new SingleSizeComponent(entity.id, 1);
            entity.addComponent(singleSizeComponent);
            console.warn('SphereColliderSystem : No SingleSizeComponent found on entity. Using a default size of 1.0.');
        }
        const colliderDesc = Rapier.ColliderDesc.ball(singleSizeComponent.size);
        if (rigidBodyComponent.body) {
            sphereColliderComponent.collider = world.createCollider(colliderDesc, rigidBodyComponent.body);
        }
    }
}
//# sourceMappingURL=SphereColliderSystem.js.map