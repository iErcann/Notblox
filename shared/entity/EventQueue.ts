import { EntityManager } from './EntityManager.js'
import { Entity } from './Entity.js'
import { SerializedEntityType } from '../network/server/serialized.js'
import { NetworkDataComponent } from '../component/NetworkDataComponent.js'
export class EventQueue {
  entity: Entity
  constructor() {
    this.entity = EntityManager.getInstance().createEntity(SerializedEntityType.EVENT)

    this.entity.addComponent(new NetworkDataComponent(this.entity.id, this.entity.type, []), false)
  }
}
