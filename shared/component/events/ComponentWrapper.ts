import { Component } from '../Component.js'

export class ComponentWrapper<T extends Component> extends Component {
  constructor(public component: T) {
    super(component.entityId)
  }
}
