import { SerializedComponentType } from '../network/server/serialized.js';
import { NetworkComponent } from '../network/NetworkComponent.js';
export class SingleSizeComponent extends NetworkComponent {
    size;
    constructor(entityId, size) {
        super(entityId, SerializedComponentType.SINGLE_SIZE);
        this.size = size;
    }
    deserialize(data) {
        this.size = data.size;
    }
    serialize() {
        return {
            size: Number(this.size.toFixed(2)),
        };
    }
}
//# sourceMappingURL=SingleSizeComponent.js.map