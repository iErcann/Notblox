import { NetworkComponent } from '../network/NetworkComponent';
import { SerializedComponentType } from '../network/server/serialized';

export class TransformControlsComponent extends NetworkComponent {
  constructor(entityId: number) {
    super(entityId, SerializedComponentType.TRANSFORM_CONTROLS);
  }

  serialize() {
    return {};
  }

  deserialize(data: any) {
    // No additional data to deserialize
  }
}