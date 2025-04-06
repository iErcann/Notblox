import { Entity } from '@shared/entity/Entity'
import { MeshComponent } from '../component/MeshComponent'
import { EventSystem } from '@shared/system/EventSystem'
import { ComponentAddedEvent } from '@shared/component/events/ComponentAddedEvent'
import { ServerMeshComponent } from '@shared/component/ServerMeshComponent'
import { EntityManager } from '@shared/system/EntityManager'
import { LoadManager } from '@/game/LoadManager'
import { AnimationComponent } from '../component/AnimationComponent'
import { SerializedEntityType } from '@shared/network/server/serialized'

export class ServerMeshSystem {
  async update(entities: Entity[]): Promise<void> {
    const createEvents = EventSystem.getEventsWrapped(ComponentAddedEvent, ServerMeshComponent)
    const promises = createEvents.map((event: ComponentAddedEvent<ServerMeshComponent>) => {
      const entity = EntityManager.getEntityById(entities, event.entityId)

      if (!entity) {
        console.error('ServerMeshSystem: Entity not found')
        return Promise.resolve() // Return a resolved promise if the entity is not found
      }
      // Hack to load the world in parallel
      // Initial load is faster
      if (entity.type === SerializedEntityType.WORLD) {
        this.onServerMeshReceived(event, entity)
        return Promise.resolve()
      }
      return this.onServerMeshReceived(event, entity)
    })

    await Promise.all(promises)
  }

  async onServerMeshReceived(
    event: ComponentAddedEvent<ServerMeshComponent>,
    entity: Entity
  ): Promise<void> {
    const serverMeshComponent = event.component

    // Load the mesh from the serverMeshComponent
    const mesh = await LoadManager.glTFLoad(serverMeshComponent.filePath)
    const meshComponent = new MeshComponent(entity.id, mesh)

    // // Debug : Add a box helper around the mesh (if player)
    // const geometry = new THREE.CapsuleGeometry(1, 1, 32)
    // const material = new THREE.MeshBasicMaterial({ wireframe: true })
    // meshComponent.mesh.geometry = geometry
    // meshComponent.mesh.material = material
    entity.addComponent(meshComponent)

    if (mesh.animations && mesh.animations.length > 0) {
      entity.addComponent(
        new AnimationComponent(entity.id, meshComponent.mesh, meshComponent.mesh.animations)
      )
    }
  }
}
