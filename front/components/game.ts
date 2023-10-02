import * as THREE from "three";
import { Camera } from "./camera";
import { EntityManager } from "./ecs/entity/EntityManager";
import { SyncComponentsSystem } from "./ecs/system/SyncComponentsSystem";
import { SyncPositionSystem } from "./ecs/system/SyncPositionSystem";
import { SyncRotationSystem } from "./ecs/system/SyncRotationSystem";
import { Renderer } from "./renderer";

export class Game {
  private static instance: Game;
  public entityManager = EntityManager.getInstance();
  private lastRenderTime = Date.now();
  private tickrate = 20;
  private loopFunction: () => void = this.loop.bind(this);
  public renderer: Renderer;
  public syncComponentSystem: SyncComponentsSystem;
  private syncPositionSystem: SyncPositionSystem;
  private syncRotationSystem: SyncRotationSystem;

  private constructor() {
    const camera = new Camera();
    this.renderer = new Renderer(camera, new THREE.Scene());
    this.syncComponentSystem = new SyncComponentsSystem(this);
    this.syncPositionSystem = new SyncPositionSystem();
    this.syncRotationSystem = new SyncRotationSystem();
    this.setupScene();
  }

  public static getInstance(): Game {
    if (!Game.instance) {
      Game.instance = new Game();
    }
    return Game.instance;
  }

  public start() {
    document.body.appendChild(this.renderer.domElement);
    this.renderer.setAnimationLoop(this.loopFunction);
  }

  private setupScene() {
    this.addLight();
    this.addGround();
  }

  private addLight() {
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 10, 0);
    light.castShadow = true;
    this.renderer.scene.add(light);
  }

  private addGround() {
    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
    const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
    groundMesh.receiveShadow = true;
    groundMesh.rotation.x = -Math.PI / 2;
    this.renderer.scene.add(groundMesh);
  }
  private interpolationFactor = 0.1; // Adjust this factor for the desired interpolation speed
  private tickRate = 20; // The tick rate in ticks per second
  private lastTickTime = 0; // Track the time of the last tick

  private loop() {
    const entities = this.entityManager.getAllEntities();
    const now = Date.now();

    // Calculate the time since the last tick
    const deltaTime = now - this.lastRenderTime;

    const interpolationFactor = deltaTime / (1000 / this.tickRate);

    // Update position and rotation with interpolation
    this.syncPositionSystem.update(entities, interpolationFactor);
    this.syncRotationSystem.update(entities, interpolationFactor);

    this.renderer.update();
    this.lastRenderTime = now;
  }
}
