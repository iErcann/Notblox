import * as THREE from "three";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

export class LoadManager {
  dracoLoader = new DRACOLoader();
  constructor() {
    this.dracoLoader.setDecoderPath("/examples/jsm/libs/draco/"); // Replace with the actual path to the Draco decoder
  }

  public load(path: string): THREE.Mesh | null {
    // Load a Draco geometry
    this.dracoLoader.load(
      // resource URL
      path,
      // called when the resource is loaded
      (geometry) => {
        const material = new THREE.MeshStandardMaterial({ color: 0x606060 });
        const mesh = new THREE.Mesh(geometry, material);
        return mesh;
      },
      // called as loading progresses
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      // called when loading has errors
      (error) => {
        console.log("An error happened");
        return null;
      }
    );
    return null;
  }
}
