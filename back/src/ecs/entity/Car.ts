import { PositionComponent } from '../../../../shared/component/PositionComponent.js'
import { RotationComponent } from '../../../../shared/component/RotationComponent.js'
import { Entity } from '../../../../shared/entity/Entity.js'
import { SerializedEntityType } from '../../../../shared/network/server/serialized.js'
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
import { VehicleComponent } from '../../../../shared/component/VehicleComponent.js'
import { ColliderPropertiesComponent } from '../component/physics/ColliderPropertiesComponent.js'
import { ProximityPromptComponent } from '../../../../shared/component/ProximityPromptComponent.js'
import { VehicleSystem } from '../system/VehicleSystem.js'
import { WheelComponent } from '../../../../shared/component/WheelComponent.js'

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

    // Create 4 wheels
    const frontLeftWheel = new WheelComponent({
      entityId: this.entity.id,
      positionComponent: new PositionComponent(this.entity.id, 4.14, -0.387, -2.46),
      rotationComponent: new RotationComponent(this.entity.id, 0, 0, 0),
      radius: 1.2,
      suspensionStiffness: 1000,
      suspensionCompression: 0.1,
      suspensionLength: 0.5,
      isSteeringWheel: true,
    })

    const frontRightWheel = new WheelComponent({
      entityId: this.entity.id,
      positionComponent: new PositionComponent(this.entity.id, 4.14, -0.387, 2.46),
      rotationComponent: new RotationComponent(this.entity.id, 0, 0, 0),
      radius: 1.2,
      suspensionStiffness: 1000,
      suspensionCompression: 0.1,
      suspensionLength: 0.5,
      isSteeringWheel: true,
    })

    const backLeftWheel = new WheelComponent({
      entityId: this.entity.id,
      positionComponent: new PositionComponent(this.entity.id, -4.14, -0.387, -2.46),
      rotationComponent: new RotationComponent(this.entity.id, 0, 0, 0),
      radius: 1.2,
      suspensionStiffness: 1000,
      suspensionCompression: 0.1,
      suspensionLength: 0.5,
    })

    const backRightWheel = new WheelComponent({
      entityId: this.entity.id,
      positionComponent: new PositionComponent(this.entity.id, -4.14, -0.387, 2.46),
      rotationComponent: new RotationComponent(this.entity.id, 0, 0, 0),
      radius: 1.2,
      suspensionStiffness: 1000,
      suspensionCompression: 0.1,
      suspensionLength: 0.5,
    })

    const wheels = [frontLeftWheel, frontRightWheel, backLeftWheel, backRightWheel]
    const vehicleComponent = new VehicleComponent(this.entity.id, wheels)
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

    const textComponent = new TextComponent(this.entity.id, 'Car prototype', 0, 5, 0, 30)
    this.entity.addComponent(textComponent)

    const sizeComponent = new SizeComponent(
      this.entity.id,
      size?.width ?? 1,
      size?.height ?? 1,
      size?.depth ?? 1
    )
    this.entity.addComponent(sizeComponent)

    this.entity.addComponent(
      new ColliderPropertiesComponent(this.entity.id, {
        friction: 0.0,
        restitution: 0.0,
      })
    )
    this.entity.addComponent(
      new ConvexHullColliderComponent(this.entity.id, meshUrl ?? 'http://localhost:4001/Car.glb')
    )
    this.entity.addComponent(
      new PhysicsPropertiesComponent(
        this.entity.id,
        physicsProperties ?? {
          enableCcd: true,
          angularDamping: 0.05,
          linearDamping: 0.05,
          mass: 5,
        }
      )
    )

    const proximityPromptComponent = new ProximityPromptComponent(this.entity.id, {
      text: 'Enter/Exit',
      onInteract: (playerEntity) => {
        VehicleSystem.handleProximityPrompt(this.entity, playerEntity)
      },
      maxInteractDistance: 15,
      interactionCooldown: 1000,
      holdDuration: 0,
    })
    this.entity.addComponent(proximityPromptComponent)

    this.entity.addComponent(new DynamicRigidBodyComponent(this.entity.id))

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
