import Rapier from '../../../physics/rapier.js';
import { Component } from '../../../../../shared/component/Component.js';
export class DynamicRigidBodyComponent extends Component {
    body;
    collider;
    scale;
    initialMass;
    needsColliderUpdate = false;
    constructor(entityId) {
        super(entityId);
        this.body = null;
        this.collider = null;
        this.scale = { x: 1, y: 1, z: 1 };
        this.initialMass = 1;
    }
    setScale(x, y, z, world) {
        this.scale = { x, y, z };
        this.needsColliderUpdate = true;
    }
    updateCollider(world) {
        if (this.body && this.collider) {
            world.removeCollider(this.collider, true);
            const colliderDesc = Rapier.ColliderDesc.cuboid(this.scale.x / 2, this.scale.y / 2, this.scale.z / 2);
            this.collider = world.createCollider(colliderDesc, this.body);
            const volume = this.scale.x * this.scale.y * this.scale.z;
            const newMass = this.initialMass * volume;
            this.body.setAdditionalMass(newMass - this.body.mass(), true);
            this.body.resetForces(true);
            this.body.resetTorques(true);
            this.body.wakeUp();
        }
    }
    initializeBody(world, position, rotation) {
        const bodyDesc = Rapier.RigidBodyDesc.dynamic()
            .setTranslation(position.x, position.y, position.z)
            .setRotation(rotation);
        this.body = world.createRigidBody(bodyDesc);
        const colliderDesc = Rapier.ColliderDesc.cuboid(this.scale.x / 2, this.scale.y / 2, this.scale.z / 2);
        this.collider = world.createCollider(colliderDesc, this.body);
        this.initialMass = this.body.mass();
    }
}
//# sourceMappingURL=DynamicRigidBodyComponent.js.map