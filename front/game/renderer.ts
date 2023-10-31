import * as THREE from "three";
import { Camera } from "./camera";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { LoadManager } from "./LoadManager";
import { Sky } from "three/examples/jsm/objects/Sky.js";

import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { GlitchPass } from "three/addons/postprocessing/GlitchPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";

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
    this.setPixelRatio(window.devicePixelRatio / 2);
    this.toneMapping = THREE.ACESFilmicToneMapping;
    this.toneMappingExposure = 0.5;

    this.addLight();
    this.addDirectionnalLight();
    this.addWorld(loadManager);
    this.addSky();
    // this.addGround();
    // Use arrow function to ensure 'this' refers to the class instance
    window.addEventListener("resize", this.onWindowResize.bind(this), false);
  }

  private addSky() {
    const sun = new THREE.Vector3();

    let sky = new Sky();

    const uniforms = sky.material.uniforms;
    uniforms["turbidity"].value = 10;
    uniforms["rayleigh"].value = 0.3;
    uniforms["mieCoefficient"].value = 0.005;
    uniforms["mieDirectionalG"].value = 0.7;

    const elevation = 2;
    const azimuth = 180;

    const phi = THREE.MathUtils.degToRad(90 - elevation);
    const theta = THREE.MathUtils.degToRad(azimuth);

    sun.setFromSphericalCoords(1, phi, theta);

    uniforms["sunPosition"].value.copy(sun);

    sky.scale.setScalar(450000);
    this.scene.add(sky);
  }
  private addDirectionnalLight() {
    // Add directional light for shadows and highlights
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);

    // this.directionalLight.castShadow = true;
    this.scene.add(this.directionalLight);
    this.scene.add(this.directionalLight.target);
    // Add the sunlight to the scene

    // const helper = new THREE.DirectionalLightHelper(this.directionalLight, 5);
    // this.scene.add(helper);
  }
  private addLight() {
    // Use HemisphereLight for natural lighting
    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
    hemisphereLight.position.set(0.5, 1, 0.75);
    this.scene.add(hemisphereLight);
  }

  private addGround() {
    // Create a simple colored ground
    const groundMaterial = new THREE.MeshPhongMaterial({
      color: 0xbdbdbd, // Adjust the color as needed (green in this case)
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
      // .glTFLoad("https://myaudio.nyc3.cdn.digitaloceanspaces.com/world_1-1.glb")
      .glTFLoad(
        // "https://myaudio.nyc3.cdn.digitaloceanspaces.com/ClearedSanAndreas.glb"
        "https://myaudio.nyc3.cdn.digitaloceanspaces.com/FootballWorld.glb"
      )
      .then((gtlf: GLTF) => {
        this.scene.add(gtlf.scene);
      });
  }
  public update() {
    // if (this.directionalLight) {
    //   this.directionalLight.position.copy(this.camera.position);
    // }
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
