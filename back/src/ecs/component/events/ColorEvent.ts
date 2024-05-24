import { Component } from '../../../../../shared/component/Component.js'

export class ColorEvent extends Component {
  constructor(entityId: number, public color: string) {
    super(entityId)
  }
}
