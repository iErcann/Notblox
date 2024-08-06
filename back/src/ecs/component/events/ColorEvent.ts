import { Component } from '../../../../../shared/component/Component.js'

/**
 * Event to change the color of an entity.
 * Used by ColorEventSystem.
 */
export class ColorEvent extends Component {
  constructor(entityId: number, public color: string) {
    super(entityId)
  }
}
