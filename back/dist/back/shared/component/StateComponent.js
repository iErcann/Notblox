import { NetworkComponent } from '../network/NetworkComponent.js';
import { SerializedComponentType, } from '../network/server/serialized.js';
export class StateComponent extends NetworkComponent {
    state;
    constructor(entityId, state) {
        super(entityId, SerializedComponentType.STATE);
        this.state = state;
    }
    deserialize(data) {
        this.state = data.state;
    }
    serialize() {
        return { state: this.state };
    }
}
//# sourceMappingURL=StateComponent.js.map