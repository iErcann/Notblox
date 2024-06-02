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

export class Player {
  entity: Entity
  debug: boolean = true

  constructor(entityId: number, game: Game) {
    this.entity = game.entityManager.createEntity(SerializedEntityType.PLAYER, entityId)

    // Capsule  debug wireframe
    // if (this.debug) {
    //   const geometry = new THREE.CapsuleGeometry(1, 1, 32)
    //   const material = new THREE.MeshBasicMaterial({ wireframe: true })
    //   mesh.geometry = geometry
    //   mesh.material = material
    // }

    // LoadManager
    //   .glTFLoad(
    //     'https://rawcdn.githack.com/iErcann/Notblox-Assets/0ac6d49540b8fb924bef1b126fbdfd965d733c3a/Character.glb'
    //   )
    //   .then((gtlf: GLTF) => {
    //     mesh.add(gtlf.scene)
    //     mesh.animations = gtlf.animations
    //     this.activateShadows()

    //     this.entity.addComponent(new AnimationComponent(this.entity.id, mesh, gtlf.animations))
    //   })
  }
}
