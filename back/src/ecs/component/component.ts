// Define a basic Component class

export enum ComponentEnum {
  NONE = 0,
  POSITION = 1,
  ROTATION = 2,
}

export interface Serializable {
  type: ComponentEnum;
  serialize(): any;
}

export class Component {
  constructor(public entityId: number) {}
}
