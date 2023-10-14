import { Camera } from "@/components/camera";
import { Component } from "@shared/component/Component";

export class FollowComponent extends Component {
  constructor(entityId: number, public camera: Camera) {
    super(entityId);
  }
}
