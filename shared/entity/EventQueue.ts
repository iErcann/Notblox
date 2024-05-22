import { EntityManager } from './EntityManager.js'
import { Entity } from './Entity.js'
import { SerializedEntityType } from '../network/server/serialized.js'

export class EventQueue {
  entity: Entity
  constructor() {
    this.entity = EntityManager.getInstance().createEntity(SerializedEntityType.EVENT)
  }
}
