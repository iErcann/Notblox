import { PositionComponent } from '../../../../shared/component/PositionComponent.js'
import { RotationComponent } from '../../../../shared/component/RotationComponent.js'
import { Entity } from '../../../../shared/entity/Entity.js'
import {
  SerializedEntityType,
  SerializedStateType,
} from '../../../../shared/network/server/serialized.js'
import { SizeComponent } from '../../../../shared/component/SizeComponent.js'
import { EntityManager } from '../../../../shared/system/EntityManager.js'
import { NetworkDataComponent } from '../../../../shared/network/NetworkDataComponent.js'
import { DynamicRigidBodyComponent } from '../component/physics/DynamicRigidBodyComponent.js'
import { ServerMeshComponent } from '../../../../shared/component/ServerMeshComponent.js'
import {
  PhysicsPropertiesComponent,
  PhysicsPropertiesComponentData,
} from '../component/physics/PhysicsPropertiesComponent.js'
import { TextComponent } from '../../../../shared/component/TextComponent.js'
import { ConvexHullColliderComponent } from '../component/physics/ConvexHullColliderComponent.js'
import { VehicleComponent as VehicleComponent } from '../../../../shared/component/VehicleComponent.js'
import { VehicleRayCastComponent } from '../system/physics/VehicleRayCastComponent.js'
import { ColliderPropertiesComponent } from '../component/physics/ColliderPropertiesComponent.js'
import { ProximityPromptComponent } from '../../../../shared/component/ProximityPromptComponent.js'
import { PlayerComponent } from '../../../../shared/component/PlayerComponent.js'
import { StateComponent } from '../../../../shared/component/StateComponent.js'

export interface CarParams {
  position: {
    x: number
    y: number
    z: number
  }
  /**
   * @default 2
   */
  size?: {
    width: number
    height: number
    depth: number
  }
  /**
   * @default "red"
   */
  color?: string
  /**
   * @default https://example.com/car.glb
   */
  meshUrl?: string
  /**
   * @default {}
   */
  physicsProperties?: PhysicsPropertiesComponentData
}

export class Car {
  entity: Entity

  constructor(params: CarParams) {
    const { position, size, color, meshUrl, physicsProperties } = params

    this.entity = EntityManager.createEntity(SerializedEntityType.VEHICLE)
    const vehicleComponent = new VehicleComponent(this.entity.id)
    this.entity.addComponent(vehicleComponent)

    const positionComponent = new PositionComponent(
      this.entity.id,
      position.x,
      position.y,
      position.z
    )
    this.entity.addComponent(positionComponent)

    const rotationComponent = new RotationComponent(this.entity.id, 0, 0, 0, 0)
    this.entity.addComponent(rotationComponent)

    const serverMeshComponent = new ServerMeshComponent(
      this.entity.id,
      meshUrl ?? 'http://localhost:4001/Car.glb'
    )
    this.entity.addComponent(serverMeshComponent)

    const textComponent = new TextComponent(this.entity.id, 'Car prototype', 0, 5, 0, 250)
    this.entity.addComponent(textComponent)

    const sizeComponent = new SizeComponent(
      this.entity.id,
      size?.width ?? 1,
      size?.height ?? 1,
      size?.depth ?? 1
    )
    this.entity.addComponent(sizeComponent)

    this.entity.addComponent(new ColliderPropertiesComponent(this.entity.id, false, 0.0, 0.0))
    this.entity.addComponent(
      new ConvexHullColliderComponent(this.entity.id, meshUrl ?? 'http://localhost:4001/Car.glb')
    )
    this.entity.addComponent(
      new PhysicsPropertiesComponent(
        this.entity.id,
        physicsProperties ?? {
          enableCcd: true,
          mass: 1,
          angularDamping: 1,
          linearDamping: 0.05,
        }
      )
    )

    const proximityPromptComponent = new ProximityPromptComponent(this.entity.id, {
      text: 'Enter/Exit',
      onInteract: (playerEntity) => {
        console.log('Car interacted', this)
        // Ensure a player is interacting with the car
        const playerComponent = playerEntity.getComponent(PlayerComponent)
        const playerStateComponent = playerEntity.getComponent(StateComponent)
        const vehicleComponent = this.entity.getComponent(VehicleComponent)

        if (playerComponent && playerStateComponent && vehicleComponent) {
          // Is there a driver?
          const vehicleHasDriver = vehicleComponent.driverEntityId !== undefined
          // Is the current player already driving a vehicle?
          const playerIsDriving = playerStateComponent.state === SerializedStateType.VEHICLE_DRIVING
          if (!vehicleHasDriver && !playerIsDriving) {
            vehicleComponent.driverEntityId = playerEntity.id
            vehicleComponent.updated = true
            playerStateComponent.state = SerializedStateType.VEHICLE_DRIVING
            playerStateComponent.updated = true

            console.log('Driver entered car')
          } else {
            // A driver exists, but is it the same player interacting?
            const samePlayer = vehicleComponent?.driverEntityId === playerEntity.id
            // if so, he's exiting the car
            if (samePlayer) {
              vehicleComponent.driverEntityId = undefined
              vehicleComponent.updated = true

              playerStateComponent.state = SerializedStateType.IDLE
              playerStateComponent.updated = true

              console.log('Driver exited car')
            }
            // Else, another player is trying to enter the car
            else {
              // TODO : Add passengers in the car (array of player ids)
              console.log('Car is already occupied by another player', vehicleComponent)
            }
          }
        }
      },
      maxInteractDistance: 15,
      interactionCooldown: 1000,
      holdDuration: 0,
    })
    this.entity.addComponent(proximityPromptComponent)

    this.entity.addComponent(new DynamicRigidBodyComponent(this.entity.id))

    this.entity.addComponent(new VehicleRayCastComponent(this.entity.id))

    const networkDataComponent = new NetworkDataComponent(this.entity.id, this.entity.type, [
      positionComponent,
      rotationComponent,
      sizeComponent,
      serverMeshComponent,
      textComponent,
      proximityPromptComponent,
      vehicleComponent,
    ])
    this.entity.addComponent(networkDataComponent)
  }
}
