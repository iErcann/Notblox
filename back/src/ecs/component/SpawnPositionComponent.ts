import { Component } from '../../../../shared/component/Component.js'

export class SpawnPositionComponent extends Component {
  constructor(entityId: number, public x: number, public y: number, public z: number) {
    super(entityId)
  }
}
