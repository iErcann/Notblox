import { PositionComponent } from '@shared/component/PositionComponent'
import { Entity } from '@shared/entity/Entity'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FollowComponent } from '../component/FollowComponent'
import * as THREE from 'three'
import { InputMessage } from '@shared/network/client/input'

export class OrbitCameraFollowSystem {
  update(dt: number, entities: Entity[], orbitControl: OrbitControls, input: InputMessage) {
    for (const entity of entities) {
      const positionComponent = entity.getComponent(PositionComponent)
      const followComponent = entity.getComponent(FollowComponent)

      if (followComponent && positionComponent) {
        const targetPosition = new THREE.Vector3(
          positionComponent.x,
          positionComponent.y + 1,
          positionComponent.z
        )

        orbitControl.target.lerp(targetPosition, dt / 60)

        const angle = Math.atan2(
          orbitControl.object.position.z - targetPosition.z,
          orbitControl.object.position.x - targetPosition.x
        )
        input.angleY = angle
      }
    }
  }
}
