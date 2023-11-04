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
import { CSS2DRenderer } from "three/addons/renderers/CSS2DRenderer.js";

export interface Renderable {
  mesh: THREE.Mesh;
  addToScene(): any;
}
export class Renderer extends THREE.WebGLRenderer {
  public camera: Camera;
  public scene: THREE.Scene;
  public css2DRenderer: CSS2DRenderer;
  constructor(scene: THREE.Scene, loadManager: LoadManager) {
    super({ antialias: true });

    this.camera = new Camera();
    this.scene = scene;

    this.shadowMap.enabled = true;
    this.shadowMap.type = THREE.PCFSoftShadowMap; //THREE.BasicShadowMap | THREE.PCFShadowMap |  THREE.VSMShadowMap | THREE.PCFSoftShadowMap

    this.setSize(window.innerWidth, window.innerHeight);
    this.setPixelRatio(window.devicePixelRatio / 1.2);
    this.toneMapping = THREE.CineonToneMapping;
    // this.toneMappingExposure = 0.5;

    this.css2DRenderer = new CSS2DRenderer();
    this.css2DRenderer.setSize(window.innerWidth, window.innerHeight);
    this.css2DRenderer.domElement.style.position = "absolute";
    this.css2DRenderer.domElement.style.top = "0";

    this.addLight();
    this.addDirectionnalLight();
    this.addWorld(loadManager);
    this.addSky();
    // this.addGround();
    // Use arrow function to ensure 'this' refers to the class instance
    window.addEventListener("resize", this.onWindowResize.bind(this), false);
  }

  public appendChild() {
    document.body.appendChild(this.domElement);
    if (this.css2DRenderer)
      document.body.appendChild(this.css2DRenderer.domElement);
    else console.error("Can't append child CSS3DRenderer");
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
    // Create a directional light for shadows and highlights
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.position.set(-1, 0.75, 1);
    directionalLight.position.multiplyScalar(50);

    // Enable shadow casting
    // directionalLight.castShadow = true;

    // Add the directional light to the scene
    this.scene.add(directionalLight);

    const side = 100;
    directionalLight.shadow.camera.top = side;
    directionalLight.shadow.camera.bottom = -side;
    directionalLight.shadow.camera.left = side;
    directionalLight.shadow.camera.right = -side;
    // Create a target for the directional light (if needed)
    const lightTarget = new THREE.Object3D();

    this.scene.add(lightTarget);
    directionalLight.target = lightTarget;

    // Add a directional light helper for visualization (optional)
    // const helper = new THREE.DirectionalLightHelper(directionalLight, 5);
    // this.scene.add(helper);
  }

  private addLight() {
    // Use HemisphereLight for natural lighting
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.8);
    hemiLight.position.set(0, 500, 0);
    this.scene.add(hemiLight);
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
        "https://myaudio.nyc3.cdn.digitaloceanspaces.com/FootballWorldBorderm.glb"
      )
      .then((gtlf: GLTF) => {
        this.scene.add(gtlf.scene);
        gtlf.scene.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true; // Make the child mesh cast shadows
            child.receiveShadow = true; // Make the child mesh receive shadows
          }
        });
      });
  }
  public update() {
    // if (this.directionalLight) {
    //   this.directionalLight.position.copy(this.camera.position);
    // }
    this.camera.update();
    this.css2DRenderer.render(this.scene, this.camera);
    this.render(this.scene, this.camera);
  }

  private onWindowResize() {
    if (!this.camera) return;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.setSize(window.innerWidth, window.innerHeight);
    this.css2DRenderer.setSize(window.innerWidth, window.innerHeight);
  }
}
