import { Component } from '@shared/component/Component';
import { Vector3 } from 'three';

export class CubeComponent extends Component {
  static readonly TYPE = 'CubeComponent';

  constructor(entityId: number) {
    super(entityId);
  }

  getType(): string {
    return CubeComponent.TYPE;
  }

  updateScale(x: number, y: number, z: number) {
    // Implement the scale update logic here
    // This might involve updating a mesh or other properties
    console.log(`Updating scale for entity ${this.entityId} to (${x}, ${y}, ${z})`);
  }
}