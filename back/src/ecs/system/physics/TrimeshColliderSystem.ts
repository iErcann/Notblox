import { Mesh } from 'three'
import { ComponentAddedEvent } from '../../../../../shared/component/events/ComponentAddedEvent.js'
import { Entity } from '../../../../../shared/entity/Entity.js'
import { BaseEventSystem } from '../../../../../shared/system/EventSystem.js'
import { GLTFLoaderManager } from '../../../GLTFLoaderManager.js'
import {
  TrimeshColliderComponent,
  TrimeshCollidersComponent,
} from '../../component/physics/TrimeshColliderComponent.js'
import Rapier from '../../../physics/rapier.js'
import { EntityManager } from '../../../../../shared/entity/EntityManager.js'
import { KinematicRigidBodyComponent } from '../../component/physics/KinematicRigidBodyComponent.js'
import { PositionComponent } from '../../../../../shared/component/PositionComponent.js'

export class TrimeshColliderSystem {
  async update(entities: Entity[], world: Rapier.World) {
    const createEvents = BaseEventSystem.getEventsWrapped(
      ComponentAddedEvent,
      TrimeshCollidersComponent
    )

    for (let event of createEvents) {
      const entity = EntityManager.getEntityById(entities, event.entityId)

      if (!entity) {
        console.error('TrimeshColliderSystem: Entity not found')
        continue
      }

      await this.onComponentAdded(event, world, entity)
    }
  }
  async onComponentAdded(
    event: ComponentAddedEvent<TrimeshCollidersComponent>,
    world: Rapier.World,
    entity: Entity
  ) {
    // For now, we only support kinematic rigid bodies for trimesh colliders
    const kinematicRigidBodyComponent = entity.getComponent(KinematicRigidBodyComponent)

    if (!kinematicRigidBodyComponent) {
      console.error('TrimeshColliderSystem: Entity does not have a KinematicRigidBodyComponent')
      return
    }
    if (!kinematicRigidBodyComponent.body) {
      console.error(
        'TrimeshColliderSystem: KinematicRigidBodyComponent exist, but it hasnt been initialized, check the order of the systems.'
      )
      return
    }

    const physicsTrimeshCollidersComponent = event.component
    physicsTrimeshCollidersComponent.colliders = []

    // TODO: Promise all this
    const model = await GLTFLoaderManager.loadGLTFModel(physicsTrimeshCollidersComponent.filePath)
    if (model) {
      model.scene.traverse((child) => {
        if (child instanceof Mesh) {
          const mesh = child as Mesh
          const indices = mesh.geometry.index?.array
          const vertices = mesh.geometry.attributes.position.array
          // Scale factor for the vertices
          const scale = mesh.getWorldScale(mesh.scale)

          // Create a new Float32Array to hold the scaled vertices
          const scaledVertices = new Float32Array(vertices.length)

          // Scale the vertices
          for (let i = 0; i < vertices.length; i += 3) {
            // Scale each coordinate individually
            scaledVertices[i] = vertices[i] * scale.x
            scaledVertices[i + 1] = vertices[i + 1] * scale.y
            scaledVertices[i + 2] = vertices[i + 2] * scale.z
          }

          // Create the trimesh collider for the current mesh
          const trimeshDesc = Rapier.ColliderDesc.trimesh(
            scaledVertices as Float32Array,
            indices as Uint32Array
          )
          trimeshDesc.setTranslation(mesh.position.x, mesh.position.y, mesh.position.z)

          trimeshDesc.setRotation({
            x: mesh.quaternion.x,
            y: mesh.quaternion.y,
            z: mesh.quaternion.z,
            w: mesh.quaternion.w,
          })

          const collider = world.createCollider(trimeshDesc, kinematicRigidBodyComponent.body)
          physicsTrimeshCollidersComponent.colliders?.push(
            new TrimeshColliderComponent(event.entityId, collider)
          )
        }
      })
      // Apply the position component if it exists, otherwise the trimesh collider will be at the origin (0, 0, 0)
      const positionComponent = entity.getComponent(PositionComponent)
      if (positionComponent) {
        kinematicRigidBodyComponent.body.setTranslation(
          new Rapier.Vector3(positionComponent.x, positionComponent.y, positionComponent.z),
          true
        )
      }
    }
  }
}
