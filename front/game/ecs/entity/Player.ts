import * as THREE from 'three'
import { MeshComponent } from '../component/MeshComponent'

import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js'

import { Entity } from '@shared/entity/Entity'
import { SerializedEntityType } from '@shared/network/server/serialized'
import { Game } from '@/game/game'
import { FollowComponent } from '../component/FollowComponent'
import { AnimationComponent } from '../component/AnimationComponent'
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js'
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js'
import { TextComponent } from '../component/TextComponent'
import { EntityManager } from '@shared/system/EntityManager'

export class Player {
  entity: Entity
  debug: boolean = true

  constructor(entityId: number) {
    this.entity = EntityManager.createEntity(SerializedEntityType.PLAYER, entityId)
  }
}
