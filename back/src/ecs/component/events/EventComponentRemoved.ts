import { Component } from '../../../../../shared/component/Component.js'

export class EventComponentRemoved extends Component {
  constructor(public removedComponent: Component) {
    super(removedComponent.entityId)
  }
}
