import * as THREE from "three";
import { Camera } from "./camera";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { LoadManager } from "./LoadManager";

export interface Renderable {
  mesh: THREE.Mesh;
  addToScene(): any;
}
export class Renderer extends THREE.WebGLRenderer {
  public camera: Camera;
  public scene: THREE.Scene;
  private directionalLight: THREE.DirectionalLight | undefined;
  constructor(scene: THREE.Scene, loadManager: LoadManager) {
    super({ antialias: false });

    this.camera = new Camera();
    this.scene = scene;

    this.shadowMap.enabled = true;
    this.shadowMap.type = THREE.PCFSoftShadowMap; //THREE.BasicShadowMap | THREE.PCFShadowMap |  THREE.VSMShadowMap | THREE.PCFSoftShadowMap

    this.setSize(window.innerWidth, window.innerHeight);
    this.setPixelRatio(window.devicePixelRatio);

    this.addLight();
    // this.addDirectionnalLight();
    // this.addWorld(loadManager);
    this.addGround();
    // Use arrow function to ensure 'this' refers to the class instance
    window.addEventListener("resize", this.onWindowResize.bind(this), false);
  }

  private addDirectionnalLight() {
    // Add directional light for shadows and highlights
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    this.directionalLight.castShadow = true;
    this.directionalLight.shadow.mapSize.x = 2048;
    this.directionalLight.shadow.mapSize.y = 2048;
    const size = 20;
    this.directionalLight.shadow.camera.top = size;
    this.directionalLight.shadow.camera.bottom = -size;
    this.directionalLight.shadow.camera.left = size;
    this.directionalLight.shadow.camera.right = -size;

    this.scene.add(this.directionalLight);
    this.scene.add(this.directionalLight.target);
    // Add the sunlight to the scene

    const helper = new THREE.DirectionalLightHelper(this.directionalLight, 5);
    this.scene.add(helper);
  }
  private addLight() {
    // Use HemisphereLight for natural lighting
    const hemisphereLight = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.8);
    hemisphereLight.position.set(0.5, 1, 0.75);
    this.scene.add(hemisphereLight);
  }

  private addGround() {
    // Create a simple colored ground
    const groundMaterial = new THREE.MeshPhongMaterial({
      color: 0xe8e8e8, // Adjust the color as needed (green in this case)
      flatShading: true,
    });

    const groundGeometry = new THREE.PlaneGeometry(1000, 1000);
    const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
    groundMesh.receiveShadow = true;
    groundMesh.castShadow = true;
    groundMesh.rotation.x = -Math.PI / 2;

    this.scene.add(groundMesh);
  }

  private addWorld(loadManager: LoadManager) {
    loadManager
      .glTFLoad("newtown__krunker_map__game_map.glb")
      .then((gtlf: GLTF) => {
        const loadedMesh = gtlf.scenes[0];
        loadedMesh.position.y = -8;
        loadedMesh.scale.set(0.5, 0.5, 0.5);
        this.scene.add(loadedMesh);
      });
  }
  public update() {
    if (this.directionalLight) {
      this.directionalLight.position.copy(this.camera.position);
    }
    this.camera.update();
    this.render(this.scene, this.camera);
  }

  private onWindowResize() {
    if (!this.camera) return;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.setSize(window.innerWidth, window.innerHeight);
  }
}
