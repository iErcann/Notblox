import * as THREE from 'three';
import { Component } from '../../../../shared/component/Component.js';
export class MeshComponent extends Component {
    mesh;
    constructor(entityId, mesh = new THREE.Mesh()) {
        super(entityId);
        this.mesh = mesh;
    }
}
//# sourceMappingURL=MeshComponent.js.map