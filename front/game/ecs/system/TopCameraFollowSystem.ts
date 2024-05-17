import * as THREE from 'three'
import { Entity } from '@shared/entity/Entity'
import { FollowComponent } from '../component/FollowComponent'
import { PositionComponent } from '@shared/component/PositionComponent'
import { Camera } from '@/game/camera'
import { InputMessage } from '@shared/network/client/input'

export class TopCameraFollowSystem {
  private lastLookAtPosition: THREE.Vector3 | undefined
  constructor(
    private positionLerpFactor = 0.05,
    private rotationLerpFactor = 0.05,
    private angle = 0,
    private rotationSpeed = 0.01
  ) {}

  update(dt: number, entities: Entity[], input: InputMessage) {
    for (const entity of entities) {
      const positionComponent = entity.getComponent(PositionComponent)
      const followComponent = entity.getComponent(FollowComponent)

      if (followComponent && positionComponent) {
        const camera = followComponent.camera
        const targetPosition = new THREE.Vector3(
          positionComponent.x,
          positionComponent.y,
          positionComponent.z
        )

        this.handleCameraRotation(dt, input)
        this.adjustCameraPosition(camera, targetPosition)
        this.rotateCameraAroundPlayer(camera, targetPosition)
        input.angleY = this.angle
      }
    }
  }
  private normalizeAngle(angle: number) {
    while (angle < 0) {
      angle += Math.PI * 2 // Add 2π to bring it into the range [0, 2π]
    }
    while (angle >= Math.PI * 2) {
      angle -= Math.PI * 2 // Subtract 2π to bring it into the range [0, 2π]
    }
    return angle
  }

  private handleCameraRotation(dt: number, input: InputMessage) {
    if (input.cameraLeft) this.angle -= this.rotationSpeed * dt
    if (input.cameraRight) this.angle += this.rotationSpeed * dt
    this.angle = this.normalizeAngle(this.angle)
  }

  private adjustCameraPosition(camera: Camera, targetPosition: THREE.Vector3) {
    const radius = camera.offset.z // Adjust this value to control camera distance
    const cameraX = targetPosition.x + radius * Math.cos(this.angle)
    const cameraZ = targetPosition.z + radius * Math.sin(this.angle)

    camera.position.lerp(
      new THREE.Vector3(cameraX, targetPosition.y + camera.offset.y, cameraZ),
      this.positionLerpFactor
    )
  }

  private rotateCameraAroundPlayer(camera: Camera, targetPosition: THREE.Vector3) {
    const lookAtPosition = targetPosition.clone()

    if (!this.lastLookAtPosition) this.lastLookAtPosition = lookAtPosition

    this.lastLookAtPosition.lerp(lookAtPosition, this.rotationLerpFactor)

    camera.lookAt(this.lastLookAtPosition.x, this.lastLookAtPosition.y, this.lastLookAtPosition.z)
  }
}
