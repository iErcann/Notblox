export type ComponentConstructor<T extends Component = Component> = new (
  entityId: number,
  ...args: any[]
) => T

export class Component {
  constructor(public entityId: number) {}
}
