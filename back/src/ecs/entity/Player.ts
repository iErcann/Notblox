import { PositionComponent } from '../../../../shared/component/PositionComponent.js'
import { RotationComponent } from '../../../../shared/component/RotationComponent.js'
import { SingleSizeComponent } from '../../../../shared/component/SingleSizeComponent.js'
import { StateComponent } from '../../../../shared/component/StateComponent.js'
import { Entity } from '../../../../shared/entity/Entity.js'
import { EntityManager } from '../../../../shared/entity/EntityManager.js'
import { BaseEventSystem } from '../../../../shared/system/EventSystem.js'
import {
  SerializedEntityType,
  SerializedStateType,
} from '../../../../shared/network/server/serialized.js'
import { GroundCheckComponent } from '../component/GroundedComponent.js'
import { InputComponent } from '../component/InputComponent.js'
import { NetworkDataComponent } from '../../../../shared/network/NetworkDataComponent.js'
import { WebSocketComponent } from '../component/WebsocketComponent.js'
import { ChatMessageEvent } from '../component/events/ChatMessageEvent.js'
import { PlayerComponent } from '../component/tag/TagPlayerComponent.js'
import { PhysicsSystem } from '../system/physics/PhysicsSystem.js'
import { DynamicRigidBodyComponent } from '../component/physics/DynamicRigidBodyComponent.js'
import { LockedRotationComponent } from '../component/LockedRotationComponent.js'
import { CapsuleColliderComponent } from '../component/physics/CapsuleColliderComponent.js'

export class Player {
  entity: Entity

  constructor(ws: WebSocket, initialX: number, initialY: number, initialZ: number) {
    this.entity = EntityManager.createEntity(SerializedEntityType.PLAYER)

    const sizeComponent = new SingleSizeComponent(this.entity.id, 1 + Math.random())
    this.entity.addComponent(sizeComponent)

    this.entity.addComponent(new WebSocketComponent(this.entity.id, ws))

    this.entity.addComponent(new PlayerComponent(this.entity.id))

    // Adding a PositionComponent with initial position
    const positionComponent = new PositionComponent(this.entity.id, initialX, initialY, initialZ)
    this.entity.addComponent(positionComponent)

    const rotationComponent = new RotationComponent(this.entity.id, 0, 1, 2)
    this.entity.addComponent(rotationComponent)

    this.entity.addComponent(new InputComponent(this.entity.id))

    this.entity.addComponent(new GroundCheckComponent(this.entity.id))

    const stateComponent = new StateComponent(this.entity.id, SerializedStateType.IDLE)
    this.entity.addComponent(stateComponent)

    this.entity.addComponent(new DynamicRigidBodyComponent(this.entity.id))
    this.entity.addComponent(new LockedRotationComponent(this.entity.id))
    this.entity.addComponent(new CapsuleColliderComponent(this.entity.id))

    // Network
    const networkDataComponent = new NetworkDataComponent(this.entity.id, this.entity.type, [
      positionComponent,
      rotationComponent,
      sizeComponent,
      stateComponent,
    ])

    this.entity.addComponent(networkDataComponent)

    BaseEventSystem.addEvent(
      new ChatMessageEvent(
        this.entity.id,
        '🖥️ [SERVER]',
        `Player ${this.entity.id} joined at ${new Date().toLocaleString()}`
      )
    )
  }
}
