import { SerializedComponentType } from '../network/server/serialized.js';
import { NetworkComponent } from '../network/NetworkComponent.js';
export class SizeComponent extends NetworkComponent {
    width;
    height;
    depth;
    constructor(entityId, width, height, depth) {
        super(entityId, SerializedComponentType.SIZE);
        this.width = width;
        this.height = height;
        this.depth = depth;
    }
    deserialize(data) {
        this.width = data.width;
        this.height = data.height;
        this.depth = data.depth;
    }
    serialize() {
        return {
            width: Number(this.width.toFixed(2)),
            height: Number(this.height.toFixed(2)),
            depth: Number(this.depth.toFixed(2)),
        };
    }
}
//# sourceMappingURL=SizeComponent.js.map