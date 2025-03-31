import * as THREE from 'three'
import { ComponentAddedEvent } from '../../../../../shared/component/events/ComponentAddedEvent.js'
import { Entity } from '../../../../../shared/entity/Entity.js'
import { EventSystem } from '../../../../../shared/system/EventSystem.js'
import { GLTFLoaderManager } from '../../../GLTFLoaderManager.js'
import {
  TrimeshColliderComponent,
  TrimeshCollidersComponent,
} from '../../component/physics/TrimeshColliderComponent.js'
import Rapier from '../../../physics/rapier.js'
import { EntityManager } from '../../../../../shared/system/EntityManager.js'
import { KinematicRigidBodyComponent } from '../../component/physics/KinematicRigidBodyComponent.js'
import { PositionComponent } from '../../../../../shared/component/PositionComponent.js'
import { ColliderPropertiesComponent } from '../../component/physics/ColliderPropertiesComponent.js'

export class TrimeshColliderSystem {
  async update(entities: Entity[], world: Rapier.World) {
    // Get all events where a TrimeshCollidersComponent was added
    const createEvents = EventSystem.getEventsWrapped(
      ComponentAddedEvent,
      TrimeshCollidersComponent
    )

    for (const event of createEvents) {
      // Find the entity corresponding to the event
      const entity = EntityManager.getEntityById(entities, event.entityId)
      if (!entity) {
        console.error('TrimeshColliderSystem: Entity not found')
        continue
      }

      // Ensure the entity has a kinematic rigid body
      const kinematicRigidBodyComponent = entity.getComponent(KinematicRigidBodyComponent)
      if (!kinematicRigidBodyComponent || !kinematicRigidBodyComponent.body) {
        console.error(
          'TrimeshColliderSystem: KinematicRigidBodyComponent is missing or uninitialized'
        )
        continue
      }

      // Initialize the colliders array for the TrimeshCollidersComponent
      const physicsTrimeshCollidersComponent = event.component
      physicsTrimeshCollidersComponent.colliders = []

      // Load the model associated with the TrimeshCollidersComponent
      const model = await GLTFLoaderManager.loadGLTFModel(physicsTrimeshCollidersComponent.filePath)
      if (!model) {
        console.error('TrimeshColliderSystem: Failed to load model')
        continue
      }

      // Traverse the scene graph to find meshes
      model.scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const mesh = child
          const indices = mesh.geometry.index?.array // Get indices from the geometry
          const vertices = mesh.geometry.attributes.position.array // Get vertices from the geometry

          if (!indices || !vertices) {
            console.error('TrimeshColliderSystem: Mesh geometry is missing indices or vertices')
            return
          }

          // Transform vertices from local space to world space
          const transformedVertices = new Float32Array(vertices.length)
          const vertex = new THREE.Vector3()

          for (let i = 0; i < vertices.length; i += 3) {
            vertex.set(vertices[i], vertices[i + 1], vertices[i + 2]) // Set the vertex position
            mesh.localToWorld(vertex) // Transform to world space
            transformedVertices[i] = vertex.x
            transformedVertices[i + 1] = vertex.y
            transformedVertices[i + 2] = vertex.z
          }

          // Create a trimesh collider descriptor
          const trimeshDesc = Rapier.ColliderDesc.trimesh(
            transformedVertices as Float32Array,
            indices as Uint32Array
          )

          // Create the collider and associate it with the rigid body
          const collider = world.createCollider(trimeshDesc, kinematicRigidBodyComponent.body)

          const colliderPropertiesComponent = entity.getComponent(ColliderPropertiesComponent)
          if (colliderPropertiesComponent) {
            if (colliderPropertiesComponent.data.friction !== undefined) {
              collider.setFriction(colliderPropertiesComponent.data.friction)
            }
            if (colliderPropertiesComponent.data.restitution !== undefined) {
              collider.setRestitution(colliderPropertiesComponent.data.restitution)
            }
            if (colliderPropertiesComponent.data.isSensor !== undefined) {
              collider.setSensor(colliderPropertiesComponent.data.isSensor)
            }
          }

          physicsTrimeshCollidersComponent.colliders.push(
            new TrimeshColliderComponent(event.entityId, collider)
          )
        }
      })

      // Set the position of the rigid body if a PositionComponent is present
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
