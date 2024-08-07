import { Component } from '../Component.js';
export class ComponentWrapper extends Component {
    component;
    constructor(component) {
        super(component.entityId);
        this.component = component;
    }
}
//# sourceMappingURL=ComponentWrapper.js.map