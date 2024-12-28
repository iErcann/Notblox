import { Mesh, Vector3 } from 'three'
import { GLTFLoaderManager } from '../../../../../back/src/GLTFLoaderManager.js'
import { ComponentAddedEvent } from '../../../../../shared/component/events/ComponentAddedEvent.js'
import { Entity } from '../../../../../shared/entity/Entity.js'
import { EntityManager } from '../../../../../shared/system/EntityManager.js'
import { EventSystem } from '../../../../../shared/system/EventSystem.js'
import Rapier from '../../../physics/rapier.js'
import { ConvexHullColliderComponent } from '../../component/physics/ConvexHullColliderComponent.js'
import { KinematicRigidBodyComponent } from '../../component/physics/KinematicRigidBodyComponent.js'
import { DynamicRigidBodyComponent } from '../../component/physics/DynamicRigidBodyComponent.js'

export class ConvexHullColliderSystem {
  async update(entities: Entity[], world: Rapier.World) {
    const createEvents = EventSystem.getEventsWrapped(
      ComponentAddedEvent,
      ConvexHullColliderComponent
    )
    for (const event of createEvents) {
      const entity = EntityManager.getEntityById(entities, event.entityId)

      if (!entity) {
        console.error('ConvexHullColliderSystem: Entity not found')
        continue
      }

      // TODO : Store a Map<MeshURL, {vertices: number[], indices: number[]}> to avoid loading the same mesh multiple times
      await this.onComponentAdded(entity, event, world)
    }
  }

  /**
   * A convex hull has been added to an entity.
   * Now we need to load the mesh from the meshUrl and create the collider with its vertices.
   *
   * Note: The GLTF format often creates extra vertices during export due to how it handles certain attributes required for rendering, such as normals, UVs, and tangents. These attributes can cause vertex splitting, where a single geometric vertex becomes multiple "logical" vertices in the exported file.
   *
   * Example: Cube
   * A cube with 8 geometric vertices can have:
   * - 24 logical vertices in GLTF, due to 6 faces × 4 vertices per face (each face's vertices are unique because of normals, UVs, etc.).
   */
  async onComponentAdded(
    entity: Entity,
    event: ComponentAddedEvent<ConvexHullColliderComponent>,
    world: Rapier.World
  ) {
    // TODO: Make a cache for the loaded models vertices and indices
    const convexHullComponent = event.component as ConvexHullColliderComponent
    const model = await GLTFLoaderManager.loadGLTFModel(convexHullComponent.meshUrl)
    if (!model) {
      console.error('ConvexHullColliderSystem: Mesh not found')
      return
    }

    const rigidBodyComponent =
      entity.getComponent(KinematicRigidBodyComponent) ||
      entity.getComponent(DynamicRigidBodyComponent)

    if (!rigidBodyComponent) {
      console.error(
        'ConvexHullColliderSystem: No RigidBodyComponent found on entity, cannot add collider'
      )
      return
    }

    const verticesArray: number[] = []

    model.scene.traverse((child) => {
      if (child instanceof Mesh) {
        const mesh = child as Mesh
        const worldPosition = new Vector3()
        mesh.getWorldPosition(worldPosition)

        console.log('ConvexHullColliderSystem: Found mesh:', mesh.name)
        const vertices = mesh.geometry.attributes.position.array
        console.log('adding', vertices.length, 'vertices')
        // Get world position and scale of the mesh
        const scale = mesh.getWorldScale(mesh.scale)

        // Scale the vertices and add to the vertices array
        for (let i = 0; i < vertices.length; i += 3) {
          verticesArray.push(worldPosition.x + vertices[i] * scale.x)
          verticesArray.push(worldPosition.y + vertices[i + 1] * scale.y)
          verticesArray.push(worldPosition.z + vertices[i + 2] * scale.z)
        }
      }
    })

    console.log(
      'ConvexHullColliderSystem: Merged mesh vertices:',
      JSON.stringify(verticesArray, null, 2)
    )
    if (verticesArray.length === 0) {
      console.error('ConvexHullColliderSystem: No vertices found in model')
      return
    }

    // Convert the vertices array to Float32Array
    const scaledVertices = new Float32Array(verticesArray)

    // Approximate the vertices if necessary (e.g., using a library like QuickHull)
    // Example: const approximatedVertices = approximateVertices(scaledVertices);

    // Create the collider using the approximated vertices
    const colliderDesc = Rapier.ColliderDesc.convexHull(scaledVertices)
    if (!colliderDesc) {
      console.error(
        'ConvexHullColliderSystem: Could not create collider descriptor, approximation of convex hull failed ?'
      )
      return
    }
    const collider = world.createCollider(colliderDesc, rigidBodyComponent.body)
    convexHullComponent.collider = collider

    console.log('ConvexHullColliderSystem: Created collider for merged mesh vertices')
  }
}
