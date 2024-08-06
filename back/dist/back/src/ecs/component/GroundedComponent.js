import { Component } from '../../../../shared/component/Component.js';
/**
 *
 * Launches a raycast downwards to check if the entity is grounded.
 *
 * Checked by `GroundCheckSystem`.
 */
export class GroundCheckComponent extends Component {
    grounded;
    constructor(entityId, grounded = false) {
        super(entityId);
        this.grounded = grounded;
    }
}
//# sourceMappingURL=GroundedComponent.js.map