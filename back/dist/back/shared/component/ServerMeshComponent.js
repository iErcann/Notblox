import { SerializedComponentType } from '../network/server/serialized.js';
import { NetworkComponent } from '../network/NetworkComponent.js';
// TODO: Fix the async load of the mesh in the front
// This will fix the color of the mesh not being set because we need for the mesh to be loaded before setting the color
/**
 * Holds the path to the rendered mesh file
 * Will be actually rendered by the client with a FrontMeshComponent
 */
export class ServerMeshComponent extends NetworkComponent {
    filePath;
    constructor(entityId, filePath) {
        super(entityId, SerializedComponentType.SERVER_MESH);
        this.filePath = filePath;
    }
    serialize() {
        return {
            p: this.filePath,
        };
    }
    deserialize(data) {
        this.filePath = data.p;
    }
}
//# sourceMappingURL=ServerMeshComponent.js.map