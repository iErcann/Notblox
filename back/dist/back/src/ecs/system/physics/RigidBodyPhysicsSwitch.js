import { EntityManager } from '../../../../../shared/system/EntityManager.js';
import { DynamicRigidBodyComponent } from '../../component/physics/DynamicRigidBodyComponent.js';
export class PhysicsSystem {
    world;
    constructor(world) {
        this.world = world;
    }
    update() {
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
    updateCollider(bodyComponent) {
        if (bodyComponent.body && bodyComponent.needsColliderUpdate) {
            bodyComponent.updateCollider(this.world);
            bodyComponent.needsColliderUpdate = false;
            console.log(`Updated collider for entity ${bodyComponent.entityId} with scale: ${bodyComponent.scale.x}, ${bodyComponent.scale.y}, ${bodyComponent.scale.z}`);
        }
    }
}
//# sourceMappingURL=RigidBodyPhysicsSwitch.js.map