import { Component } from '@shared/component/Component'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls'

export class TransformControlsComponent extends Component {
  controls: TransformControls | null = null

  constructor(entityId: number) {
    super(entityId)
    this.type = 'TransformControlsComponent'
  }
}