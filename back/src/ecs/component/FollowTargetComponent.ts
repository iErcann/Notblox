import { Component } from '../../../../shared/component/Component.js'
export class FollowTargetComponent extends Component {
  constructor(
    public entityId: number,
    public targetEntityId: number,
    public offset: { x: number; y: number; z: number }
  ) {
    super(entityId)
  }
}
