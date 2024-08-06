import { SerializedEntityType } from '@shared/network/server/serialized'
import { Entity } from '@shared/entity/Entity'
import { MeshComponent } from '../component/MeshComponent.js'
import * as THREE from 'three'
import { Game } from '@/game/game.js'
import { EntityManager } from '@shared/system/EntityManager.js'
import { TransformControlsComponent } from '../component/TransformControlsComponent'

export class Cube {
  entity: Entity

  constructor(entityId: number) {
    this.entity = EntityManager.createEntity(SerializedEntityType.CUBE, entityId)
    this.entity.addComponent(new TransformControlsComponent(this.entity.id))
  }
}