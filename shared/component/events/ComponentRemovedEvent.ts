import { Component } from '../Component.js'

export class ComponentRemovedEvent<T extends Component> extends Component {
  constructor(public removedComponent: Component) {
    super(removedComponent.entityId)
  }
}
