// Define a basic Component class

export interface Serializable {
  serialize(): any;
}

export class Component {
  constructor(public entityId: number) {}
}
