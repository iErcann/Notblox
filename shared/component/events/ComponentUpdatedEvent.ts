import { Component } from '../Component.js'

export class ComponentUpdatedEvent<T extends Component> extends Component {
  constructor(public updatedComponent: Component) {
    super(updatedComponent.entityId)
  }
}
