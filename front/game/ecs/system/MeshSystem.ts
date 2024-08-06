import { Renderer } from '@/game/renderer.js'
import { Entity } from '@shared/entity/Entity.js'
import { EventSystem } from '@shared/system/EventSystem.js'
import { MeshComponent } from '../component/MeshComponent.js'
import { ComponentAddedEvent } from '@shared/component/events/ComponentAddedEvent.js'
import { ComponentRemovedEvent } from '@shared/component/events/ComponentRemovedEvent.js'
import * as THREE from 'three'
import { TextComponent } from '../component/TextComponent.js'
import { EntityManager } from '@shared/system/EntityManager.js'

export class MeshSystem {
  update(entities: Entity[], renderer: Renderer) {
    // Handle added components
    const addedMeshEvents = EventSystem.getEventsWrapped(ComponentAddedEvent, MeshComponent)
    for (const addedEvent of addedMeshEvents) {
      const meshComponent = addedEvent.component as MeshComponent
      if (meshComponent) {
        console.log('MeshSystem: Adding mesh to scene')
        this.activateShadows(meshComponent)
        renderer.scene.add(meshComponent.mesh)
        this.setupClickHandler(meshComponent.mesh, addedEvent.entity);
      }
    }

    // Handle removed components
    const removedMeshEvents = EventSystem.getEventsWrapped(ComponentRemovedEvent, MeshComponent)
    for (const removedEvent of removedMeshEvents) {
      const meshComponent = removedEvent.component as MeshComponent
      if (meshComponent) {
        renderer.scene.remove(meshComponent.mesh)
      }
    }
  }
  activateShadows(meshComponent: MeshComponent) {
    if (meshComponent) {
      const object3D = meshComponent.mesh
      object3D.castShadow = true // Make the mesh cast shadows
      object3D.receiveShadow = true // Make the mesh receive shadows

      // Enable shadows for all child meshes
      object3D.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material.metalness = 0
          child.castShadow = true // Make the child mesh cast shadows
          child.receiveShadow = true // Make the child mesh receive shadows
        }
      })
    }
  }

  private setupClickHandler(mesh: THREE.Mesh, entity: Entity) {
    mesh.addEventListener('click', (event) => {
      if (event.button === 0) { // Left click
        const cube = entity as Cube;
        cube.enableTransformControls();
      }
    });
  }
}