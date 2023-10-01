import * as THREE from "three";
import { Camera } from "./camera";
import { Renderer } from "./renderer";
import { Player } from "./oldPlayer";
import { SyncComponentsSystem } from "./ecs/system/SyncComponentsSystem";
import { SyncPositionSystem } from "./ecs/system/SyncPositionSystem";
import { SyncRotationSystem } from "./ecs/system/SyncRotationSystem";
import { Entity } from "@shared/entity/Entity";
import { MeshComponent } from "./ecs/component/MeshComponent";
export class Game {
  lastRenderTime = Date.now();
  tickrate = 20;
  renderer: Renderer;
  entities: Entity[] = [];
  loopFunction: () => void = this.loop.bind(this);
  syncComponentSystem: SyncComponentsSystem;
  syncPositionSystem: SyncPositionSystem;
  syncRotationSystem: SyncRotationSystem;
  constructor() {
    const camera = new Camera();
    this.renderer = new Renderer(camera, new THREE.Scene());
    this.syncComponentSystem = new SyncComponentsSystem(this);
    this.syncPositionSystem = new SyncPositionSystem();
    this.syncRotationSystem = new SyncRotationSystem();
    // Adding a light
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 10, 0);
    light.castShadow = true;
    this.renderer.scene.add(light);
    // Adding a ground
    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.MeshPhongMaterial();
    groundMaterial.color = new THREE.Color(0xffffff);
    const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
    groundMesh.receiveShadow = true;
    groundMesh.rotation.x = -Math.PI / 2;
    this.renderer.scene.add(groundMesh);
  }

  loop() {
    const now = Date.now();
    this.syncPositionSystem.update(this.entities);
    this.syncRotationSystem.update(this.entities);

    // if (this.entities.length > 0) {
    //   const randomEntity = this.entities[this.entities.length - 1];
    //   const meshComponent = randomEntity.getComponent(MeshComponent);

    //   if (meshComponent) {
    //     this.renderer.camera.lookAt(meshComponent.mesh.position);
    //   } else {
    //     console.warn("Selected entity does not have a valid MeshComponent.");
    //   }
    // } else {
    //   console.warn("No entities available to follow.");
    // }

    this.renderer.update();
    this.lastRenderTime = now;
  }

  start() {
    document.body.appendChild(this.renderer.domElement);
    this.renderer.setAnimationLoop(this.loopFunction);
  }
}
