import { Renderer } from '@/game/Renderer.js'
import { Entity } from '@shared/entity/Entity.js'
import { EventSystem } from '@shared/system/EventSystem.js'
import { MeshComponent } from '../component/MeshComponent.js'
import { ComponentAddedEvent } from '@shared/component/events/ComponentAddedEvent.js'
import { ComponentRemovedEvent } from '@shared/component/events/ComponentRemovedEvent.js'
import * as THREE from 'three'
import { PositionComponent } from '@shared/component/PositionComponent.js'
import { RotationComponent } from '@shared/component/RotationComponent.js'
import { EntityManager } from '@shared/system/EntityManager.js'

export class MeshSystem {
  update(entities: Entity[], renderer: Renderer) {
    this.handleAddedMeshes(entities, renderer)
    this.handleRemovedMeshes(renderer)
  }

  private handleAddedMeshes(entities: Entity[], renderer: Renderer) {
    const addedMeshEvents = EventSystem.getEventsWrapped(ComponentAddedEvent, MeshComponent)

    for (const addedEvent of addedMeshEvents) {
      const entity = EntityManager.getEntityById(entities, addedEvent.entityId)
      if (!entity) {
        console.error('MeshSystem: Entity not found')
        continue
      }

      const meshComponent = addedEvent.component
      this.updateMeshTransform(entity, meshComponent)
      this.addMeshToScene(meshComponent, renderer)
    }
  }

  private handleRemovedMeshes(renderer: Renderer) {
    const removedMeshEvents = EventSystem.getEventsWrapped(ComponentRemovedEvent, MeshComponent)

    for (const removedEvent of removedMeshEvents) {
      const meshComponent = removedEvent.component
      renderer.scene.remove(meshComponent.mesh)
    }
  }

  private updateMeshTransform(entity: Entity, meshComponent: MeshComponent) {
    const positionComponent = entity.getComponent(PositionComponent)
    if (positionComponent) {
      meshComponent.mesh.position.set(positionComponent.x, positionComponent.y, positionComponent.z)
    }

    const rotationComponent = entity.getComponent(RotationComponent)
    if (rotationComponent) {
      meshComponent.mesh.quaternion.set(
        rotationComponent.x,
        rotationComponent.y,
        rotationComponent.z,
        rotationComponent.w
      )
    }
  }

  private addMeshToScene(meshComponent: MeshComponent, renderer: Renderer) {
    console.log('MeshSystem: Adding mesh to scene')
    this.activateShadows(meshComponent)
    renderer.scene.add(meshComponent.mesh)
  }

  private activateShadows(meshComponent: MeshComponent) {
    const object3D = meshComponent.mesh
    object3D.castShadow = true
    object3D.receiveShadow = true

    object3D.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material.metalness = 0
        child.castShadow = true
        child.receiveShadow = true
      }
    })
  }
}
