import { EntityManager } from '../../../../shared/entity/EntityManager.js'
import { Entity } from '../../../../shared/entity/Entity.js'
import { SerializedEntityType } from '../../../../shared/network/server/serialized.js'
import { TrimeshCollidersComponent } from '../component/physics/TrimeshColliderComponent.js'
import { KinematicRigidBodyComponent } from '../component/physics/KinematicRigidBodyComponent.js'
import { PositionComponent } from '../../../../shared/component/PositionComponent.js'

export class MapWorld {
  entity: Entity
  constructor() {
    this.entity = EntityManager.getInstance().createEntity(SerializedEntityType.WORLD)

    this.entity.addComponent(new PositionComponent(this.entity.id, 0, 0, 0))

    this.entity.addComponent(new KinematicRigidBodyComponent(this.entity.id))

    this.entity.addComponent(
      new TrimeshCollidersComponent(this.entity.id, '../front/public/assets/keneeyworldled.glb')
    )
    // const networkDataComponent = new NetworkDataComponent(this.entity.id, this.entity.type, [])
  }
}
