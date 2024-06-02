import { Game } from '@/game/game'
import { Entity } from '@shared/entity/Entity'
import { SerializedEntityType } from '@shared/network/server/serialized'
import { EntityManager } from '@shared/system/EntityManager'
import { useEffect } from 'react'

export class Chat {
  entity: Entity
  constructor(entityId: number) {
    this.entity = EntityManager.createEntity(SerializedEntityType.CHAT, entityId)
  }
}
