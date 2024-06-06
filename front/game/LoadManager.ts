import * as THREE from 'three'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js'

export class LoadManager {
  private static instance: LoadManager
  private cache = new Map<string, THREE.Mesh>()
  dracoLoader = new DRACOLoader()
  gltfLoader = new GLTFLoader()

  private constructor() {
    this.dracoLoader.setDecoderPath('/draco/') // Replace with the actual path to the Draco decoder
    this.gltfLoader.setDRACOLoader(this.dracoLoader)
  }

  static getInstance(): LoadManager {
    if (!LoadManager.instance) {
      LoadManager.instance = new LoadManager()
    }
    return LoadManager.instance
  }

  static glTFLoad(path: string): Promise<THREE.Mesh> {
    const instance = LoadManager.getInstance()

    // // Check if the mesh is already in the cache
    if (instance.cache.has(path)) {
      const cachedMesh = instance.cache.get(path)!
      const clonedMesh = instance.cloneMesh(cachedMesh)
      return Promise.resolve(clonedMesh)
    }

    // If not, load the model and store the mesh in the cache
    return new Promise((resolve, reject) => {
      instance.gltfLoader.load(
        path,
        (gltf) => {
          // Extract the first mesh from the loaded model
          const mesh = instance.extractMesh(gltf)
          if (mesh) {
            // Cache the original mesh
            instance.cache.set(path, mesh)
            // Resolve with a clone of the mesh
            const clonedMesh = instance.cloneMesh(mesh)
            resolve(clonedMesh)
          } else {
            reject(new Error('No mesh found in the GLTF model'))
          }
        },
        // called as loading progresses
        (xhr) => {
          console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
        },
        // called when loading has errors
        (error) => {
          console.error('An error happened', error)
          reject(error)
        }
      )
    })
  }

  private cloneMesh(mesh: THREE.Mesh): THREE.Mesh {
    const clonedMesh = SkeletonUtils.clone(mesh)
    clonedMesh.animations = mesh.animations
    // Clone materials to avoid sharing the same material instance
    clonedMesh.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const material = child.material
        if (Array.isArray(material)) {
          child.material = material.map((m) => m.clone())
        } else {
          child.material = material.clone()
        }
      }
    })
    return clonedMesh as THREE.Mesh
  }

  private extractMesh(gltf: any): THREE.Mesh | null {
    let mesh: THREE.Mesh = new THREE.Mesh()
    mesh.add(gltf.scene)
    mesh.animations = gltf.animations
    return mesh
  }
}
