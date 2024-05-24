import { Component } from '../../../../../shared/component/Component.js'

export class SizeEvent extends Component {
  constructor(entityId: number, public width: number, public height: number, public depth: number) {
    super(entityId)
  }
}
