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
import { Camera } from '@/game/camera'

export class Player {
  entity: Entity
  debug: boolean = true

  constructor(public entityId: number, private game: Game) {
    this.entity = EntityManager.createEntity(SerializedEntityType.PLAYER, entityId)
  }

  // Method to clean up resources when player disconnects
  disconnect() {
    // Remove any components or clean up any resources specific to this player
    // For example:
    // this.entity.removeComponent(MeshComponent)
    // this.entity.removeComponent(FollowComponent)
    // this.entity.removeComponent(AnimationComponent)
    // this.entity.removeComponent(TextComponent)

    // Finally, remove the entity
    EntityManager.removeEntity(this.entity)
  }

  // You can add more methods here as needed, for example:
  addMesh(mesh: THREE.Mesh) {
    const meshComponent = new MeshComponent(this.entityId)
    meshComponent.mesh = mesh
    this.entity.addComponent(meshComponent)
  }

  addFollowComponent() {
    this.entity.addComponent(new FollowComponent(this.entityId, this.game.renderer.camera))
  }

  addAnimationComponent(mesh?: THREE.Mesh, animations?: THREE.AnimationClip[]) {
    const animationComponent = new AnimationComponent(this.entityId)
    if (mesh) {
      animationComponent.setMesh(mesh)
    }
    if (animations) {
      animationComponent.setAnimations(animations)
    }
    this.entity.addComponent(animationComponent)
  }

  addNameTag(name: string) {
    const textComponent = new TextComponent(this.entityId, name)
    this.entity.addComponent(textComponent)
  }
}