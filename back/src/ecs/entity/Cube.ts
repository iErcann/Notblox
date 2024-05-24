import { PositionComponent } from '../../../../shared/component/PositionComponent.js'
import { RotationComponent } from '../../../../shared/component/RotationComponent.js'

import { Entity } from '../../../../shared/entity/Entity.js'
import { SerializedEntityType } from '../../../../shared/network/server/serialized.js'

import { ColorComponent } from '../../../../shared/component/ColorComponent.js'
import { SizeComponent } from '../../../../shared/component/SizeComponent.js'
import { EntityManager } from '../../../../shared/entity/EntityManager.js'
import Rapier from '../../physics/rapier.js'
import { NetworkDataComponent } from '../../../../shared/component/NetworkDataComponent.js'
import { DynamicPhysicsBodyComponent } from '../component/DynamicPhysicsBodyComponent.js'
import { PhysicsColliderComponent } from '../component/PhysicsColliderComponent.js'
import { PhysicsSystem } from '../system/physics/PhysicsSystem.js'

export class Cube {
  entity: Entity

  constructor(x: number, y: number, z: number, width: number, height: number, depth: number) {
    this.entity = EntityManager.getInstance().createEntity(SerializedEntityType.CUBE)
    const world = PhysicsSystem.getInstance().world

    // Adding a PositionComponent with initial position
    const positionComponent = new PositionComponent(this.entity.id, x, y, z)
    this.entity.addComponent(positionComponent)

    const rotationComponent = new RotationComponent(this.entity.id, 0, 0, 0, 0)
    this.entity.addComponent(rotationComponent)

    const sizeComponent = new SizeComponent(this.entity.id, width, height, depth)
    this.entity.addComponent(sizeComponent)

    const colorComponent = new ColorComponent(this.entity.id, '#ff0000')
    this.entity.addComponent(colorComponent)

    this.createRigidBody(world)
    this.createCollider(world)

    const networkDataComponent = new NetworkDataComponent(this.entity.id, this.entity.type, [
      positionComponent,
      rotationComponent,
      sizeComponent,
      colorComponent,
    ])
    this.entity.addComponent(networkDataComponent)
  }
  getPosition() {
    return this.entity.getComponent<PositionComponent>(PositionComponent)!
  }
  createRigidBody(world: Rapier.World) {
    const { x, y, z } = this.getPosition()
    // Rigidbody
    let rigidBodyDesc = Rapier.RigidBodyDesc.dynamic()

    let rigidBody = world.createRigidBody(rigidBodyDesc)
    rigidBody.setTranslation(new Rapier.Vector3(x, y, z), false)
    this.entity.addComponent(new DynamicPhysicsBodyComponent(this.entity.id, rigidBody))
  }
  createCollider(world: Rapier.World) {
    // Collider
    const sizeComponent = this.entity.getComponent(SizeComponent)
    const rigidBodyComponent = this.entity.getComponent(DynamicPhysicsBodyComponent)

    if (!rigidBodyComponent) {
      console.error("BodyComponent doesn't exist on Cube.")
      return
    }

    if (!sizeComponent) {
      console.error("SizeComponent doesn't exist on Cube.")
      return
    }

    let colliderDesc = Rapier.ColliderDesc.cuboid(
      sizeComponent.width,
      sizeComponent.height,
      sizeComponent.depth
    )
    let collider = world.createCollider(colliderDesc, rigidBodyComponent.body)

    this.entity.addComponent(new PhysicsColliderComponent(this.entity.id, collider))
  }
}
