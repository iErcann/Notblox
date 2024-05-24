import Rapier from '../../../physics/rapier.js'
import { Entity } from '../../../../../shared/entity/Entity.js'
import { TrimeshEvent } from '../../component/events/TrimeshEvent.js'
import { DRACOLoader, GLTF, GLTFLoader } from 'node-three-gltf'
import { Mesh } from 'three'

export class TrimeshEventSystem {
  private gltfLoader: GLTFLoader

  constructor() {
    this.gltfLoader = new GLTFLoader()
    this.gltfLoader.setDRACOLoader(new DRACOLoader())
  }

  async loadGLTFModel(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.gltfLoader.load(
        url,
        (gltf) => {
          resolve(gltf) // Resolve the promise when loading is successful
        },
        undefined, // onProgress callback (you can add one if needed)
        (error) => {
          reject(error) // Reject the promise on error
        }
      )
    })
  }

  async update(entities: Entity[], world: Rapier.World) {
    // An array to store the promises for GLTF model loading
    const loadPromises: Promise<void>[] = []

    for (const entity of entities) {
      const eventTrimeshComponent = entity.getComponent(TrimeshEvent)
      if (eventTrimeshComponent) {
        const loadPromise = this.loadGLTFModel(eventTrimeshComponent.filePath)
          .then(async (gltf: GLTF) => {
            if (gltf) {
              console.log('Loading map', eventTrimeshComponent.filePath)
              // Iterate over all child objects in the GLTF scene
              gltf.scene.traverse((child) => {
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
                  // Create a kinematic position-based rigid body
                  const rigidBody = Rapier.RigidBodyDesc.kinematicPositionBased()

                  // Create the collider and attach it to the rigid body
                  world.createCollider(trimeshDesc, world.createRigidBody(rigidBody))
                  // console.log('Created trimesh for', mesh.name)
                }
              })
            }
          })
          .catch((error) => {
            console.error('Error loading GLTF model:', error)
          })

        loadPromises.push(loadPromise)
        entity.removeComponent(TrimeshEvent)
      }
    }

    // Wait for all GLTF model loading and trimesh creation to complete
    await Promise.all(loadPromises)
  }
}
