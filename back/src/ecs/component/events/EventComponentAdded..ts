import { Component } from '../../../../../shared/component/Component.js'

export class EventComponentAdded extends Component {
  constructor(public addedComponent: Component) {
    super(addedComponent.entityId)
  }
}
