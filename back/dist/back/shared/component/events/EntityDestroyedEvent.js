import { SerializedComponentType } from '../../network/server/serialized.js';
import { NetworkComponent } from '../../network/NetworkComponent.js';
/**
 * NetworkEvent that is sent when an entity is destroyed
 *
 * Used to clean up the entity on the client side (remove mesh, etc)
 */
export class EntityDestroyedEvent extends NetworkComponent {
    constructor(entityId) {
        super(entityId, SerializedComponentType.DESTROYED_EVENT);
    }
    deserialize(data) {
        this.entityId = data.id;
    }
    serialize() {
        return {
            id: this.entityId,
        };
    }
}
//# sourceMappingURL=EntityDestroyedEvent.js.map