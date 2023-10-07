import * as THREE from "three";
import { Camera } from "./camera";
export interface Renderable {
  mesh: THREE.Mesh;
  addToScene(): any;
}
export class Renderer extends THREE.WebGLRenderer {
  public camera: Camera;
  public scene: THREE.Scene;

  constructor(camera: Camera, scene: THREE.Scene) {
    super({ antialias: false });

    this.camera = camera;
    this.scene = scene;

    this.setSize(window.innerWidth, window.innerHeight);
    this.setPixelRatio(window.devicePixelRatio / 2);

    this.addLight();

    // Use arrow function to ensure 'this' refers to the class instance
    window.addEventListener("resize", this.onWindowResize.bind(this), false);
  }

  private addLight() {
    // Use HemisphereLight for natural lighting
    const hemisphereLight = new THREE.HemisphereLight(0x0000ff, 0x00ff00, 0.6);
    this.scene.add(hemisphereLight);

    // Add directional light for shadows and highlights
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(2, 3, 3);
    directionalLight.castShadow = true;
    this.scene.add(directionalLight);

    // Add the sunlight to the scene

    const helper = new THREE.DirectionalLightHelper(directionalLight, 5);
    this.scene.add(helper);
  }

  public update() {
    this.render(this.scene, this.camera);
  }

  private onWindowResize() {
    if (!this.camera) return;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.setSize(window.innerWidth, window.innerHeight);
  }
}
