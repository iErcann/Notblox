import { InputComponent } from '../component/InputComponent.js';
import Rapier from '../../physics/rapier.js';
import { PositionComponent } from '../../../../shared/component/PositionComponent.js';
import { GroundCheckComponent } from '../component/GroundedComponent.js';
import { DynamicRigidBodyComponent } from '../component/physics/DynamicRigidBodyComponent.js';
export class MovementSystem {
    update(dt, entities) {
        for (const entity of entities) {
            this.updateEntityMovement(dt, entity);
        }
    }
    updateEntityMovement(dt, entity) {
        const inputComponent = entity.getComponent(InputComponent);
        const rigidBodyComponent = entity.getComponent(DynamicRigidBodyComponent);
        const positionComponent = entity.getComponent(PositionComponent);
        const groundedCheckComponent = entity.getComponent(GroundCheckComponent);
        if (!inputComponent || !rigidBodyComponent || !positionComponent || !groundedCheckComponent) {
            return; // Skip processing this entity if any required component is missing
        }
        const impulse = this.calculateImpulse(dt, inputComponent, rigidBodyComponent);
        // If the space key is pressed and the entity is grounded, apply an impulse
        if (inputComponent.space && groundedCheckComponent && groundedCheckComponent.grounded) {
            impulse.y = 0.8 * dt;
        }
        this.applyImpulse(dt, rigidBodyComponent, impulse);
    }
    calculateImpulse(dt, inputComponent, rigidBodyComponent) {
        if (!rigidBodyComponent.body) {
            return new Rapier.Vector3(0, 0, 0);
        }
        const currentLinVel = rigidBodyComponent.body.linvel();
        const speed = 0.27;
        const lookingYAngle = inputComponent.lookingYAngle;
        const impulse = new Rapier.Vector3(0, currentLinVel.y, 0);
        if (inputComponent.up) {
            impulse.z += -speed * Math.sin(lookingYAngle);
            impulse.x += -speed * Math.cos(lookingYAngle);
        }
        if (inputComponent.down) {
            impulse.z += speed * Math.sin(lookingYAngle);
            impulse.x += speed * Math.cos(lookingYAngle);
        }
        if (inputComponent.right) {
            impulse.z += speed * Math.sin(lookingYAngle - Math.PI / 2);
            impulse.x += speed * Math.cos(lookingYAngle - Math.PI / 2);
        }
        if (inputComponent.left) {
            impulse.z += speed * Math.sin(lookingYAngle + Math.PI / 2);
            impulse.x += speed * Math.cos(lookingYAngle + Math.PI / 2);
        }
        impulse.x *= dt;
        impulse.z *= dt;
        return impulse;
    }
    applyImpulse(dt, rigidBodyComponent, impulse) {
        if (!rigidBodyComponent.body) {
            return;
        }
        rigidBodyComponent.body.setLinvel(impulse, true);
    }
}
//# sourceMappingURL=MovementSystem.js.map