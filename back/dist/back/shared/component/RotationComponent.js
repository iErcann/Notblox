import { SerializedComponentType } from '../network/server/serialized.js';
import { NetworkComponent } from '../network/NetworkComponent.js';
// Define a RotationComponent class
export class RotationComponent extends NetworkComponent {
    x;
    y;
    z;
    w;
    constructor(entityId, x, y, z, w = 0) {
        super(entityId, SerializedComponentType.ROTATION);
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }
    deserialize(data) {
        this.x = data.x;
        this.y = data.y;
        this.z = data.z;
        this.w = data.w;
    }
    serialize() {
        return {
            x: Number(this.x.toFixed(2)),
            y: Number(this.y.toFixed(2)),
            z: Number(this.z.toFixed(2)),
            w: Number(this.w.toFixed(2)),
        };
    }
}
//# sourceMappingURL=RotationComponent.js.map