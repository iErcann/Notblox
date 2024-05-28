import { Component } from '../../../../shared/component/Component.js'

export class TrimeshComponent extends Component {
  constructor(
    entityId: number,
    public dx: number,
    public dy: number
  ) {
    super(entityId) // Call the parent constructor with the entityId
  }
}
