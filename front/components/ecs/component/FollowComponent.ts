import { Component } from "@shared/component/Component";

export class FollowComponent extends Component {
  constructor(entityId: number, public camera: THREE.Camera) {
    super(entityId);
  }
}
