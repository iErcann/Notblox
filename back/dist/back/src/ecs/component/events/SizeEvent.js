import { Component } from '../../../../../shared/component/Component.js';
/**
 * Event to change the size of an entity.
 * Used by SizeEventSystem.
 */
export class SizeEvent extends Component {
    width;
    height;
    depth;
    constructor(entityId, width, height, depth) {
        super(entityId);
        this.width = width;
        this.height = height;
        this.depth = depth;
    }
}
//# sourceMappingURL=SizeEvent.js.map