import { ColorComponent } from '@shared/component/ColorComponent'
import { Entity } from '@shared/entity/Entity'
import * as THREE from 'three'
import { MeshComponent } from '../component/MeshComponent'
import { EventSystem } from '@shared/system/EventSystem'
import { ComponentAddedEvent } from '@shared/component/events/ComponentAddedEvent'
import { ServerMeshComponent } from '@shared/component/ServerMeshComponent'
import { EntityManager } from '@shared/system/EntityManager'
import { LoadManager } from '@/game/LoadManager'
import { AnimationComponent } from '../component/AnimationComponent'

export class ServerMeshSystem {
  async update(entities: Entity[]) {
    const createEvents = EventSystem.getEventsWrapped(ComponentAddedEvent, ServerMeshComponent)
    for (const event of createEvents) {
      const entity = EntityManager.getEntityById(entities, event.entityId)

      if (!entity) {
        console.error('ServerMeshSystem: Entity not found')
        continue
      }
      this.onComponentAdded(event, entity)
    }
  }
  async onComponentAdded(event: ComponentAddedEvent<ServerMeshComponent>, entity: Entity) {
    const serverMeshComponent = event.component
    // const existingMeshComponent = entity.getComponent(MeshComponent)
    // if (existingMeshComponent) {
    //   // A MeshComponent already exists, we delete it, it will throw a ComponentRemovedEvent<MeshComponent>
    //   // that will handle the removal of the mesh from the scene
    //   entity.removeComponent(MeshComponent)
    // }

    // Load the mesh from the serverMeshComponent
    const gltf = await LoadManager.glTFLoad(serverMeshComponent.filePath)
    const meshComponent = new MeshComponent(entity.id)
    // Debug : Add a box helper around the mesh
    const geometry = new THREE.CapsuleGeometry(1, 1, 32)
    const material = new THREE.MeshBasicMaterial({ wireframe: true })
    meshComponent.mesh.geometry = geometry
    meshComponent.mesh.material = material
    meshComponent.mesh.add(gltf.scene)
    entity.addComponent(meshComponent)

    if (gltf.animations && gltf.animations.length > 0) {
      meshComponent.mesh.animations = gltf.animations
      entity.addComponent(
        new AnimationComponent(entity.id, meshComponent.mesh, meshComponent.mesh.animations)
      )
    }
  }
}
