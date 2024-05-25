import { Component } from '../../../../shared/component/Component.js'

/**
 * Put this component on an entity to check if it is grounded.
 *
 * Launches a raycast downwards to check if the entity is grounded.
 *
 * Checked by `GroundCheckSystem`.
 */
export class GroundCheckComponent extends Component {
  constructor(entityId: number, public grounded: boolean = false) {
    super(entityId)
  }
}
