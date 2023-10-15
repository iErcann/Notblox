import * as THREE from "three";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export class LoadManager {
  dracoLoader = new DRACOLoader();
  gltfLoader = new GLTFLoader();

  constructor() {
    this.dracoLoader.setDecoderPath("/draco/"); // Replace with the actual path to the Draco decoder
  }

  public dracoLoad(path: string): Promise<THREE.Mesh> {
    return new Promise((resolve, reject) => {
      // Load a Draco geometry
      this.dracoLoader.load(
        // resource URL
        path,
        // called when the resource is loaded
        (geometry) => {
          const material = new THREE.MeshStandardMaterial({ color: 0x606060 });
          const mesh = new THREE.Mesh(geometry, material);
          resolve(mesh);
        },
        // called as loading progresses
        (xhr) => {
          console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
        },
        // called when loading has errors
        (error) => {
          console.error("An error happened", error);
          reject(error);
        }
      );
    });
  }

  public glTFLoad(path: string): Promise<THREE.Object3D> {
    return new Promise((resolve, reject) => {
      // Load a GLTF model
      this.gltfLoader.load(
        path,
        (gltf) => {
          // You can access the loaded model directly using gltf.scene or gltf.scenes[0]
          resolve(gltf.scene || gltf.scenes[0]);
        },
        // called as loading progresses
        (xhr) => {
          console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
        },
        // called when loading has errors
        (error) => {
          console.error("An error happened", error);
          reject(error);
        }
      );
    });
  }
}
