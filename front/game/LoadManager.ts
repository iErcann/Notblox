import * as THREE from 'three'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

export class LoadManager {
  private static instance: LoadManager
  dracoLoader = new DRACOLoader()
  gltfLoader = new GLTFLoader()

  constructor() {
    this.dracoLoader.setDecoderPath('/draco/') // Replace with the actual path to the Draco decoder
    this.gltfLoader.setDRACOLoader(this.dracoLoader)
  }

  static getInstance(): LoadManager {
    if (!LoadManager.instance) {
      LoadManager.instance = new LoadManager()
    }
    return LoadManager.instance
  }

  static glTFLoad(path: string): Promise<GLTF> {
    return new Promise((resolve, reject) => {
      // Load a GLTF model
      LoadManager.getInstance().gltfLoader.load(
        path,
        (gltf) => {
          // You can access the loaded model directly using gltf.scene or gltf.scenes[0]
          resolve(gltf)
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
}
