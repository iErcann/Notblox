import { Component } from '../../../../../shared/component/Component.js'

export class EventSingleSize extends Component {
  constructor(
    entityId: number,
    public size: number
  ) {
    super(entityId)
  }
}
