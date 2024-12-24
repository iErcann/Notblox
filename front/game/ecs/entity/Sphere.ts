import { SerializedEntityType } from '@shared/network/server/serialized'
import { Entity } from '@shared/entity/Entity'
import { EntityManager } from '@shared/system/EntityManager.js'

export class Sphere {
  entity: Entity
  constructor(entityId: number) {
    this.entity = EntityManager.createEntity(SerializedEntityType.SPHERE, entityId)
  }
}
