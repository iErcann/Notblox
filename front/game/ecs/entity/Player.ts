import { Entity } from '@shared/entity/Entity'
import { SerializedEntityType } from '@shared/network/server/serialized'
import { EntityManager } from '@shared/system/EntityManager'

export class Player {
  entity: Entity
  debug: boolean = true

  constructor(entityId: number) {
    this.entity = EntityManager.createEntity(SerializedEntityType.PLAYER, entityId)
  }
}
