import { Component } from '../../../../../shared/component/Component.js';
export class TrimeshColliderComponent extends Component {
    collider;
    constructor(entityId, collider) {
        super(entityId);
        this.collider = collider;
    }
}
export class TrimeshCollidersComponent extends Component {
    filePath;
    colliders;
    constructor(entityId, filePath, colliders) {
        super(entityId);
        this.filePath = filePath;
        this.colliders = colliders;
    }
}
//# sourceMappingURL=TrimeshColliderComponent.js.map