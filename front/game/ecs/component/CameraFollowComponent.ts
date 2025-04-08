import { Camera } from '@/game/Camera'
import { Component } from '@shared/component/Component'

export class CameraFollowComponent extends Component {
  constructor(entityId: number, public camera: Camera) {
    super(entityId)
  }
}
