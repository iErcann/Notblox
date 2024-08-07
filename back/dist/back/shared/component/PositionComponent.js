import { SerializedComponentType } from '../network/server/serialized.js';
import { NetworkComponent } from '../network/NetworkComponent.js';
export class PositionComponent extends NetworkComponent {
    x;
    y;
    z;
    constructor(entityId, x, y, z) {
        super(entityId, SerializedComponentType.POSITION);
        this.x = x;
        this.y = y;
        this.z = z;
    }
    deserialize(data) {
        this.x = data.x;
        this.y = data.y;
        this.z = data.z;
    }
    serialize() {
        return {
            x: Number(this.x.toFixed(2)),
            y: Number(this.y.toFixed(2)),
            z: Number(this.z.toFixed(2)),
        };
    }
}
//# sourceMappingURL=PositionComponent.js.map