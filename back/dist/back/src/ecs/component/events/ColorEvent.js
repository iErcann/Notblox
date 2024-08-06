import { Component } from '../../../../../shared/component/Component.js';
/**
 * Event to change the color of an entity.
 * Used by ColorEventSystem.
 */
export class ColorEvent extends Component {
    color;
    constructor(entityId, color) {
        super(entityId);
        this.color = color;
    }
}
//# sourceMappingURL=ColorEvent.js.map