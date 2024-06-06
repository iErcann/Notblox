import { DRACOLoader, GLTF, GLTFLoader } from 'node-three-gltf'

export class GLTFLoaderManager {
  private static instance: GLTFLoaderManager
  private gltfLoader: GLTFLoader

  private constructor() {
    this.gltfLoader = new GLTFLoader()
    this.gltfLoader.setDRACOLoader(new DRACOLoader())
  }

  static getInstance(): GLTFLoaderManager {
    if (!GLTFLoaderManager.instance) {
      GLTFLoaderManager.instance = new GLTFLoaderManager()
    }
    return GLTFLoaderManager.instance
  }

  static loadGLTFModel(url: string): Promise<GLTF> {
    return new Promise((resolve, reject) => {
      GLTFLoaderManager.getInstance().gltfLoader.load(
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
}
