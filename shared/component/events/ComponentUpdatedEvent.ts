import { Component } from '../Component.js'
import { ComponentWrapper } from './ComponentWrapper.js'

export class ComponentUpdatedEvent<T extends Component> extends ComponentWrapper<T> {
  constructor(component: T) {
    super(component)
  }
}
