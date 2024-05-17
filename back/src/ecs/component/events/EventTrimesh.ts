import { Component } from '../../../../../shared/component/Component.js'

export class EventTrimesh extends Component {
  constructor(
    entityId: number,
    public filePath: string
  ) {
    super(entityId)
  }
}
