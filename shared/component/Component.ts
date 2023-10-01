import { SerializedComponentType } from "../serialized.js";

export interface Serializable {
  type: SerializedComponentType;
  serialize(): any;
  deserialize(data: any): void;
}

export class Component {
  constructor(public entityId: number) {}
}
