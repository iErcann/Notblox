import * as THREE from "three";
import { Camera } from "./camera";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
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
    this.setPixelRatio(window.devicePixelRatio);

    this.addLight();
    // this.addDirectionnalLight();
    // this.addWorld();
    // this.addGround();
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
    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x00ff00, 1);
    this.scene.add(hemisphereLight);
  }

  private addGround() {
    // Create a simple colored ground
    const groundMaterial = new THREE.MeshPhongMaterial({
      color: 0x1eefff, // Adjust the color as needed (green in this case)
    });

    const groundGeometry = new THREE.PlaneGeometry(1000, 1000);
    const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
    groundMesh.receiveShadow = true;
    groundMesh.rotation.x = -Math.PI / 2;
    this.scene.add(groundMesh);
  }

  private addWorld() {
    const loader = new GLTFLoader();

    const that = this;
    loader.load(
      "https://myaudio.nyc3.cdn.digitaloceanspaces.com/SanAndreas.glb",
      function (gltf) {
        gltf.scene.traverse(function (child) {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        gltf.scene.position.setY(-5);
        that.scene.add(gltf.scene);
        gltf.animations;
        Array<THREE.AnimationClip>;
        gltf.scene;
        THREE.Group;
        gltf.scenes;
        Array<THREE.Group>;
        gltf.cameras;
        Array<THREE.Camera>;
        gltf.asset;
        Object;
      },
      // called while loading is progressing
      function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      // called when loading has errors
      function (error) {
        console.log("An error happened");
      }
    );
  }
  public update() {
    this.render(this.scene, this.camera);
    if (this.directionalLight) {
      this.directionalLight.position.copy(this.camera.position);
    }
  }

  private onWindowResize() {
    if (!this.camera) return;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.setSize(window.innerWidth, window.innerHeight);
  }
}
