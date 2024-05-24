import { Component } from '../../../../../shared/component/Component.js'

export class TrimeshEvent extends Component {
  constructor(entityId: number, public filePath: string) {
    super(entityId)
  }
}
