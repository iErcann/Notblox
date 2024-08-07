import { Component } from '@shared/component/Component'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js'

export class TransformControlsComponent extends Component {
  static readonly TYPE = 'TransformControlsComponent';
  controls: TransformControls | null = null

  constructor(entityId: number) {
    super(entityId)
  }

  getType(): string {
    return TransformControlsComponent.TYPE;
  }
}