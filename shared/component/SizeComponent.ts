import { Component, Serializable } from "../component/Component.js";
import {
  SerializedComponentType,
  SerializedSizeComponent,
} from "../network/server/serialized.js";

export class SizeComponent extends Component implements Serializable {
  type = SerializedComponentType.SIZE;

  constructor(
    entityId: number,
    public width: number,
    public height: number,
    public depth: number
  ) {
    super(entityId);
  }
  deserialize(data: SerializedSizeComponent): void {
    this.width = data.width;
    this.height = data.height;
    this.depth = data.depth;
  }
  serialize(): SerializedSizeComponent {
    return {
      width: Number(this.width.toFixed(2)),
      height: Number(this.height.toFixed(2)),
      depth: Number(this.depth.toFixed(2)),
    };
  }
}
