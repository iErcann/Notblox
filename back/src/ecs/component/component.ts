import { SerializedComponentType } from "@shared/serialized.js";

export interface Serializable {
  type: SerializedComponentType;
  serialize(): any;
}

export class Component {
  constructor(public entityId: number) {}
}
