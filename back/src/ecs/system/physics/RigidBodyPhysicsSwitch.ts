import Rapier from '../../../physics/rapier.js';
import { EntityManager } from '../../../../../shared/system/EntityManager.js';
import { DynamicRigidBodyComponent } from '../../component/physics/DynamicRigidBodyComponent.js';
import { Entity } from '../../../../../shared/entity/Entity.js';

export class PhysicsSystem {
    private world: Rapier.World;

    constructor(world: Rapier.World) {
        this.world = world;
    }

    update(): void {
        const entities = EntityManager.getInstance().getAllEntities();
        entities.forEach(entity => {
            const bodyComponent = entity.getComponent(DynamicRigidBodyComponent);
            if (bodyComponent && bodyComponent.needsColliderUpdate) {
                this.updateCollider(bodyComponent);
            }
        });

        // Step the physics world
        this.world.step();
    }

    private updateCollider(bodyComponent: DynamicRigidBodyComponent): void {
        if (bodyComponent.body && bodyComponent.needsColliderUpdate) {
            bodyComponent.updateCollider(this.world);
            bodyComponent.needsColliderUpdate = false;
            console.log(`Updated collider for entity ${bodyComponent.entityId} with scale: ${bodyComponent.scale.x}, ${bodyComponent.scale.y}, ${bodyComponent.scale.z}`);
        }
    }
}