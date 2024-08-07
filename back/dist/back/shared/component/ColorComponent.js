import { SerializedComponentType } from '../network/server/serialized.js';
import { NetworkComponent } from '../network/NetworkComponent.js';
// Define a ColorComponent class
export class ColorComponent extends NetworkComponent {
    color;
    constructor(entityId, color) {
        super(entityId, SerializedComponentType.COLOR); // Call the parent constructor with the entityId
        this.color = color;
    }
    deserialize(data) {
        this.color = data.color;
    }
    serialize() {
        return {
            color: this.color,
        };
    }
}
//# sourceMappingURL=ColorComponent.js.map