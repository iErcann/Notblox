import * as THREE from "three";
import { Camera } from "./camera";
export interface Renderable {
  mesh: THREE.Mesh;
  addToScene(): any;
}
export class Renderer extends THREE.WebGLRenderer {
  public camera: Camera;
  public scene: THREE.Scene;
  private directionalLight: THREE.DirectionalLight | undefined;

  constructor(camera: Camera, scene: THREE.Scene) {
    super({ antialias: false });

    this.camera = camera;
    this.scene = scene;

    this.setSize(window.innerWidth, window.innerHeight);
    this.setPixelRatio(window.devicePixelRatio);

    this.addLight();

    // Use arrow function to ensure 'this' refers to the class instance
    window.addEventListener("resize", this.onWindowResize.bind(this), false);
  }

  private addLight() {
    this.shadowMap.enabled = true;
    this.shadowMap.type = THREE.PCFSoftShadowMap;

    this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
    this.directionalLight.position.set(0.2, 0.5, 0.3);
    this.directionalLight.castShadow = true;
    this.directionalLight.shadow.radius = 100;

    this.scene.add(this.directionalLight);

    const hemiLight = new THREE.HemisphereLight(0x0000ff, 0x00ff00, 0.2);
    this.scene.add(hemiLight);

    const light = new THREE.PointLight(0xff0000, 1, 100);
    light.position.set(-2, 0, 1);
    light.castShadow = true;

    this.scene.add(light);
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
