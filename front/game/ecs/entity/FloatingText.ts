import { Entity } from '@shared/entity/Entity'
import { SerializedEntityType } from '@shared/network/server/serialized'
import { EntityManager } from '@shared/system/EntityManager'

export class FloatingText {
  entity: Entity
  constructor(entityId: number) {
    this.entity = EntityManager.createEntity(SerializedEntityType.FLOATING_TEXT, entityId)
  }
}
