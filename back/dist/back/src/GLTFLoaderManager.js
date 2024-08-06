import { DRACOLoader, GLTFLoader } from 'node-three-gltf';
export class GLTFLoaderManager {
    static instance;
    gltfLoader;
    constructor() {
        this.gltfLoader = new GLTFLoader();
        this.gltfLoader.setDRACOLoader(new DRACOLoader());
    }
    static getInstance() {
        if (!GLTFLoaderManager.instance) {
            GLTFLoaderManager.instance = new GLTFLoaderManager();
        }
        return GLTFLoaderManager.instance;
    }
    static loadGLTFModel(url) {
        return new Promise((resolve, reject) => {
            GLTFLoaderManager.getInstance().gltfLoader.load(url, (gltf) => {
                resolve(gltf); // Resolve the promise when loading is successful
            }, undefined, // onProgress callback (you can add one if needed)
            (error) => {
                reject(error); // Reject the promise on error
            });
        });
    }
}
//# sourceMappingURL=GLTFLoaderManager.js.map