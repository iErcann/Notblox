import { PositionComponent } from '../../../../shared/component/PositionComponent.js'
import { RotationComponent } from '../../../../shared/component/RotationComponent.js'
import { Entity } from '../../../../shared/entity/Entity.js'
import { SerializedEntityType } from '../../../../shared/network/server/serialized.js'
import { SizeComponent } from '../../../../shared/component/SizeComponent.js'
import { EntityManager } from '../../../../shared/system/EntityManager.js'
import { NetworkDataComponent } from '../../../../shared/network/NetworkDataComponent.js'
import { BoxColliderComponent } from '../component/physics/BoxColliderComponent.js'
import { DynamicRigidBodyComponent } from '../component/physics/DynamicRigidBodyComponent.js'
import { ServerMeshComponent } from '../../../../shared/component/ServerMeshComponent.js'
import { ColorComponent } from '../../../../shared/component/ColorComponent.js'
import {
  PhysicsPropertiesComponent,
  PhysicsPropertiesComponentData,
} from '../component/physics/PhysicsPropertiesComponent.js'
import { TextComponent } from '../../../../shared/component/TextComponent.js'
import { ConvexHullColliderComponent } from '../component/physics/ConvexHullColliderComponent.js'

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

    this.entity = EntityManager.createEntity(SerializedEntityType.CAR)

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
      meshUrl ?? 'http://localhost:4001/Monkey.glb'
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

    this.entity.addComponent(
      new ConvexHullColliderComponent(this.entity.id, meshUrl ?? 'http://localhost:4001/Monkey.glb')
    )
    this.entity.addComponent(
      new PhysicsPropertiesComponent(
        this.entity.id,
        physicsProperties ?? {
          enableCcd: true,
          angularDamping: 0.2,
          linearDamping: 0.2,
          mass: 1,
        }
      )
    )
    this.entity.addComponent(new DynamicRigidBodyComponent(this.entity.id))

    const networkDataComponent = new NetworkDataComponent(this.entity.id, this.entity.type, [
      positionComponent,
      rotationComponent,
      sizeComponent,
      serverMeshComponent,
      textComponent,
    ])
    this.entity.addComponent(networkDataComponent)
  }
}
