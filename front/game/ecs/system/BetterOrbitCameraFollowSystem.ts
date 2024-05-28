import { Camera } from '@/game/camera'
import { PositionComponent } from '@shared/component/PositionComponent'
import { Entity } from '@shared/entity/Entity'
import CameraControls from 'camera-controls'
import input from 'postcss/lib/input'
import * as THREE from 'three'
import { FollowComponent } from '../component/FollowComponent'
import { InputMessage } from '@shared/network/client/input'

/* https://github.com/yomotsu/meshwalk/blob/master/src/TPS/TPSCameraControls.ts */
export class BetterOrbitCameraFollowSystem {
  private cameraControls: CameraControls
  private offset = new THREE.Vector3(0, 1, 0)
  constructor(camera: Camera, renderer: THREE.WebGLRenderer) {
    CameraControls.install({ THREE: THREE })
    this.cameraControls = new CameraControls(camera, renderer.domElement)
    this.cameraControls.minDistance = 1
    this.cameraControls.maxDistance = 100
    this.cameraControls.azimuthRotateSpeed = 0.3 // negative value to invert rotation direction
    this.cameraControls.polarRotateSpeed = 0.2 // negative value to invert rotation direction
    this.cameraControls.minPolarAngle = 30 * THREE.MathUtils.DEG2RAD
    this.cameraControls.maxPolarAngle = 90 * THREE.MathUtils.DEG2RAD
    this.cameraControls.draggingSmoothTime = 1e-10
    this.cameraControls.dollyDragInverted = true

    this.cameraControls.mouseButtons.middle = CameraControls.ACTION.ZOOM
    this.cameraControls.mouseButtons.right = CameraControls.ACTION.NONE

    // this.cameraControls.mouseButtons.middle = CameraControls.ACTION.NONE
    this.cameraControls.touches.two = CameraControls.ACTION.TOUCH_DOLLY
    this.cameraControls.touches.three = CameraControls.ACTION.TOUCH_DOLLY
    // Pointerlock
  }

  update(dt: number, entities: Entity[], input: InputMessage) {
    this.cameraControls.update(dt)
    for (const entity of entities) {
      const positionComponent = entity.getComponent(PositionComponent)
      const followComponent = entity.getComponent(FollowComponent)

      if (followComponent && positionComponent) {
        const newTargetPosition = new THREE.Vector3(
          positionComponent.x,
          positionComponent.y + this.offset.y,
          positionComponent.z
        )
        let oldTargetPosition = new THREE.Vector3() // Initialize oldTargetPosition
        this.cameraControls.getTarget(oldTargetPosition)
        // Lerp the target position to the new target position
        oldTargetPosition.lerp(newTargetPosition, 0.05)

        this.cameraControls.moveTo(
          oldTargetPosition.x,
          oldTargetPosition.y,
          oldTargetPosition.z,
          true
        )
        const angle = Math.atan2(
          this.cameraControls.camera.position.z - newTargetPosition.z,
          this.cameraControls.camera.position.x - newTargetPosition.x
        )
        input.angleY = angle
      }
    }
  }
}
