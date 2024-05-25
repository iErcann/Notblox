import { PositionComponent } from '../../../../shared/component/PositionComponent.js'
import { RotationComponent } from '../../../../shared/component/RotationComponent.js'
import { EntityDestroyedEvent } from '../../../../shared/component/events/EntityDestroyedEvent.js'

import { Entity } from '../../../../shared/entity/Entity.js'
import { SerializedEntityType } from '../../../../shared/network/server/serialized.js'

import Rapier from '../../physics/rapier.js'
import { NetworkDataComponent } from '../../../../shared/component/NetworkDataComponent.js'
import { PhysicsSystem } from '../system/physics/PhysicsSystem.js'
import { EntityManager } from '../../../../shared/entity/EntityManager.js'
import { SingleSizeComponent } from '../../../../shared/component/SingleSizeComponent.js'
import { ColorComponent } from '../../../../shared/component/ColorComponent.js'
import { DynamicRigidBodyComponent } from '../component/physics/DynamicRigidBodyComponent.js'
import { ColliderComponent } from '../component/physics/ColliderComponent.js'

export class Sphere {
  entity: Entity

  constructor(x: number, y: number, z: number, size: number) {
    this.entity = EntityManager.getInstance().createEntity(SerializedEntityType.SPHERE)
    const world = PhysicsSystem.getInstance().world

    // Adding a PositionComponent with initial position
    const positionComponent = new PositionComponent(this.entity.id, x, y, z)
    this.entity.addComponent(positionComponent)

    const rotationComponent = new RotationComponent(this.entity.id, 0, 0, 0, 0)
    this.entity.addComponent(rotationComponent)

    const sizeComponent = new SingleSizeComponent(this.entity.id, size)
    this.entity.addComponent(sizeComponent)

    const colorComponent = new ColorComponent(this.entity.id, '#FFFFFF')
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
    rigidBodyDesc.setLinearDamping(1)

    let rigidBody = world.createRigidBody(rigidBodyDesc)
    rigidBody.setTranslation(new Rapier.Vector3(x, y, z), false)
    this.entity.addComponent(new DynamicRigidBodyComponent(this.entity.id, rigidBody))
  }
  createCollider(world: Rapier.World) {
    // Collider
    const sizeComponent = this.entity.getComponent(SingleSizeComponent)
    const rigidBodyComponent = this.entity.getComponent(DynamicRigidBodyComponent)

    if (!rigidBodyComponent) {
      console.error("BodyComponent doesn't exist on Sphere.")
      return
    }

    if (!sizeComponent) {
      console.error("SizeComponent doesn't exist on Sphere.")
      return
    }

    let colliderDesc = Rapier.ColliderDesc.ball(sizeComponent.size)
    let collider = world.createCollider(colliderDesc, rigidBodyComponent.body)

    this.entity.addComponent(new ColliderComponent(this.entity.id, collider))
  }
}
