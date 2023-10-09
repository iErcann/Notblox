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

    this.shadowMap.enabled = true;
    this.shadowMap.type = THREE.PCFSoftShadowMap; //THREE.BasicShadowMap | THREE.PCFShadowMap |  THREE.VSMShadowMap | THREE.PCFSoftShadowMap

    this.setSize(window.innerWidth, window.innerHeight);
    this.setPixelRatio(window.devicePixelRatio / 1.8);

    this.addLight();

    // Use arrow function to ensure 'this' refers to the class instance
    window.addEventListener("resize", this.onWindowResize.bind(this), false);
  }

  private addLight() {
    // Use HemisphereLight for natural lighting
    const hemisphereLight = new THREE.HemisphereLight(0x0000ff, 0x00ff00, 0.6);
    this.scene.add(hemisphereLight);

    // Add directional light for shadows and highlights
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    this.directionalLight.position.set(2, 3, 3);
    this.directionalLight.castShadow = true;
    this.directionalLight.shadow.mapSize.x = 2048;
    this.directionalLight.shadow.mapSize.y = 204;
    this.scene.add(this.directionalLight);

    // Add the sunlight to the scene

    const helper = new THREE.DirectionalLightHelper(this.directionalLight, 5);
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
