import { Component } from '../../../../../shared/component/Component.js';
/**
 * Event to change the size of an entity.
 * Used by SingleSizeEventSystem.
 */
export class SingleSizeEvent extends Component {
    size;
    constructor(entityId, size) {
        super(entityId);
        this.size = size;
    }
}
//# sourceMappingURL=SingleSizeEvent.js.map